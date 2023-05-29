from __future__ import annotations
from datetime import datetime
from typing import Any, Optional
import json
import os
import src
import pydantic
import rich.console
import tum_esm_utils
import tum_esm_em27_metadata

PROFFAST_VERSION = "2.2"
_PROJECT_DIR = tum_esm_utils.files.get_parent_dir_path(__file__, current_depth=2)
CACHE_PATH = os.path.join(_PROJECT_DIR, "cache.json")
console = rich.console.Console()


class Cache(pydantic.BaseModel):
    uploaded_items: list[Cache.Item]

    class Item(pydantic.BaseModel):
        date: str
        checksum: str
        last_modified: str

    @staticmethod
    def load() -> Cache:
        if not os.path.isfile(CACHE_PATH):
            new_cache = Cache(uploaded_items=[])
            new_cache.dump()
            return new_cache
        with open(os.path.join(_PROJECT_DIR, "cache.json"), "r") as f:
            return Cache(**json.load(f))

    def dump(self) -> None:
        with open(CACHE_PATH, "w") as f:
            json.dump(self.dict(), f, indent=4)

    def add(self, item: Cache.Item) -> None:
        self.uploaded_items.append(item)
        self.uploaded_items = sorted(self.uploaded_items, key=lambda i: i.date)
        self.dump()

    def get_checksum(self, date: str) -> Optional[str]:
        try:
            return next(filter(lambda i: i.date == date, self.uploaded_items)).checksum
        except StopIteration:
            return None


class SensorDataLoader:
    def __init__(
        self,
        sensor_id: str,
        location_data: tum_esm_em27_metadata.EM27MetadataInterface,
    ) -> None:
        self.config = src.config.Config.load()
        self.sensor_id = sensor_id
        self.data_dir = f"{self.config.data.src_dir}/{self.sensor_id}/proffast-{PROFFAST_VERSION}-outputs/successful"

        self.location_data = location_data
        self.serial_number = next(
            filter(lambda s: s.sensor_id == self.sensor_id, location_data.sensors)
        ).serial_number

        self.cache = Cache.load()

    def get_new_dates(self) -> list[str]:
        if not os.path.isdir(self.data_dir):
            return []
        new_dates: list[str] = []
        cached_dates: list[str] = []
        for date in sorted(os.listdir(self.data_dir)):
            csv_path = self.get_output_file_path(date)
            if not os.path.isfile(csv_path):
                continue
            uploaded_checksum = self.cache.get_checksum(date)
            file_checksum = tum_esm_utils.files.get_file_checksum(csv_path)
            if uploaded_checksum != file_checksum:
                new_dates.append(date)
            else:
                cached_dates.append(date)

        console.print(
            f"Found {len(new_dates)} new and {len(cached_dates)} cached date(s)",
            style="bright_white",
        )
        """
        console.print(
            f"  new dates: {new_dates}",
            style="grey78",
            no_wrap=False,
            highlight=False,
        )
        console.print(
            f"  cached dates: {cached_dates}",
            style="grey78",
            no_wrap=False,
            highlight=False,
        )"""
        return new_dates

    def get_output_file_path(self, date: str) -> str:
        return (
            f"{self.data_dir}/{date}/comb_invparms_ma_SN"
            + f"{str(self.serial_number).zfill(3)}"
            + f"_{date[2:]}-{date[2:]}.csv"
        )

    def get_date_records(self, date: str) -> list[dict[Any, Any]]:
        df = tum_esm_utils.files.load_raw_proffast_output(
            self.get_output_file_path(date)
        )
        records: list[dict[Any, Any]] = []
        location_id = self.location_data.get(self.sensor_id, date).location.location_id

        for row in df.iter_rows():
            records.append(
                {
                    "proffast_version": PROFFAST_VERSION,
                    "location_id": location_id,
                    "sensor_id": self.sensor_id,
                    "raw": True,
                    "utc": row[0].isoformat(),
                    "gnd_p": round(row[1], 6),
                    "gnd_t": round(row[2], 6),
                    "app_sza": round(row[3], 6),
                    "azimuth": round(row[4], 6),
                    "xh2o": round(row[5], 6),
                    "xair": round(row[6], 6),
                    "xco2": round(row[7], 6),
                    "xch4": round(row[8], 6),
                    "xco": round(row[9], 6),
                    "xch4_s5p": round(row[10], 6),
                }
            )

        # TODO: postprocess raw dataframe and add records to list

        return records

    def add_date_to_cache_list(self, date: str) -> None:
        csv_path = self.get_output_file_path(date)
        checksum = tum_esm_utils.files.get_file_checksum(csv_path)
        self.cache.add(
            Cache.Item(
                date=date,
                checksum=checksum,
                last_modified=datetime.utcnow().isoformat(),
            )
        )
