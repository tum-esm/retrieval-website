import os
from typing import Any
import tum_esm_utils

PROFFAST_VERSION = "2.2"
SENSOR_IDS = ["ma"]
LOCATION_ID = "TUM_I"
SERIAL_NUMBERS = {
    "ma": "061",
    "mb": "086",
    "mc": "115",
    "md": "116",
    "me": "117",
}
BASE_DIR = f"/mnt/dss-0002/proffast-archive"


# TODO: add caching (only consider dates where raw output
# file has changed -> do a checksum of each file and store
# it in a .cache.json file))


class SensorDataLoader:
    def __init__(self, sensor_id: str) -> None:
        self.sensor_id = sensor_id
        self.data_dir = f"{BASE_DIR}/{self.sensor_id}/proffast-{PROFFAST_VERSION}-outputs/successful"

    def get_dates(self) -> list[str]:
        if not os.path.isdir(self.data_dir):
            return []
        return [
            date
            for date in sorted(os.listdir(self.data_dir))
            if os.path.isfile(self.get_output_file_path(date))
        ]

    def get_output_file_path(self, date: str) -> None:
        return (
            f"comb_invparms_ma_SN{SERIAL_NUMBERS[self.sensor_id]}"
            + f"_{date[2:]}-{date[2:]}.csv"
        )

    def get_date_records(self, date: str) -> list[dict[Any, Any]]:
        df = tum_esm_utils.files.load_raw_proffast_output(
            self.get_output_file_path(date)
        )

        records: list[dict[Any, Any]] = []

        for row in df.iter_rows():
            records.append(
                {
                    "proffast_version": PROFFAST_VERSION,
                    "location_id": LOCATION_ID,
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

        # TODO: fetch real location id from em27 location data
        # TODO: postprocess raw dataframe and add records to list

        return records
