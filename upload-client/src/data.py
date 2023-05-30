from __future__ import annotations
from datetime import datetime
from typing import Any, Optional
import json
import os
import numpy as np
import src
import pydantic
import rich.console
import tum_esm_utils
import tum_esm_em27_metadata

PROFFAST_VERSION = "2.2"
_PROJECT_DIR = tum_esm_utils.files.get_parent_dir_path(__file__, current_depth=2)
CACHE_PATH = os.path.join(_PROJECT_DIR, "cache.json")


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

    def get_new_dates(self, console: rich.console.Console) -> list[str]:
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
            f"  Found [blue]{len(new_dates)}[/blue] new and "
            + f"[blue]{len(cached_dates)}[/blue] cached date(s)",
            style="bold bright_white",
            highlight=False,
        )
        return new_dates

    def get_output_file_path(self, date: str) -> str:
        return (
            f"{self.data_dir}/{date}/comb_invparms_{self.sensor_id}_SN"
            + f"{str(self.serial_number).zfill(3)}"
            + f"_{date[2:]}-{date[2:]}.csv"
        )

    def get_date_record(
        self, date: str, console: rich.console.Console
    ) -> dict[Any, Any]:
        location_id = self.location_data.get(self.sensor_id, date).location.location_id
        data_columns = [
            "gnd_p",
            "gnd_t",
            "app_sza",
            "azimuth",
            "xh2o",
            "xair",
            "xco2",
            "xch4",
            "xco",
            "xch4_s5p",
        ]

        df = tum_esm_utils.files.load_raw_proffast_output(
            self.get_output_file_path(date)
        )
        postprocessed_df = src.utils.post_process_dataframe(df)
        assert df.columns == ["utc", *data_columns]
        assert postprocessed_df.columns == ["utc", *data_columns]

        console.print(
            f"    raw dataframe has [blue]{len(df)}[/blue] rows",
            highlight=False,
            style="grey78",
        )
        console.print(
            f"    postprocessed dataframe has [blue]{len(postprocessed_df)}[/blue] rows",
            highlight=False,
            style="grey78",
        )

        raw_measurements: list[dict[str, Any]] = []
        postprocessed_measurements: list[dict[str, Any]] = []

        def to_clean_float(x: Any) -> Any:
            if x in [np.nan, np.inf, -np.inf]:
                return None
            return round(x, 6)

        for row in df.iter_rows():
            raw_measurements.append(
                {
                    k: to_clean_float(v)
                    for k, v in {
                        "utc_hour": row[0].hour
                        + (row[0].minute / 60)
                        + (row[0].second / 3600),
                        **{
                            data_columns[i]: row[i + 1]
                            for i in range(len(data_columns))
                        },
                    }.items()
                }
            )

        for row in postprocessed_df.iter_rows():
            postprocessed_measurements.append(
                {
                    k: to_clean_float(v)
                    for k, v in {
                        "utc_hour": row[0].hour
                        + (row[0].minute / 60)
                        + (row[0].second / 3600),
                        **{
                            data_columns[i]: row[i + 1]
                            for i in range(len(data_columns))
                        },
                    }.items()
                }
            )

        return {
            "proffast_version": PROFFAST_VERSION,
            "sensor_id": self.sensor_id,
            "location_id": location_id,
            "utc_date": f"{date[:4]}-{date[4:6]}-{date[6:]}",
            "raw_measurement_count": len(df),
            "postprocessed_measurement_count": len(postprocessed_df),
            "raw_measurements": json.dumps(raw_measurements),
            "postprocessed_measurements": json.dumps(postprocessed_measurements),
        }

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
