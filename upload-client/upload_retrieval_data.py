from contextlib import contextmanager
from datetime import datetime
import json
import os
import time
from typing import Generator
import requests
import polars as pl
import tum_esm_utils
import pydantic
import multiprocessing

PROFFAST_VERSION = "2.2"
LOCATION_ID = "TUM_I"
SENSOR_IDS = ["ma"]
SERIAL_NUMBERS = {
    "ma": "061",
}
BASE_DIR = f"/mnt/dss-0002/proffast-archive"
THREAD_COUNT = 32
MAX_REQUESTS_PER_SECONDS = 45


@contextmanager
def _ensure_min_section_duration(duration: float) -> Generator[None, None, None]:
    start_time = time.time()
    yield
    remaining_loop_time = start_time + duration - time.time()
    if remaining_loop_time > 0:
        time.sleep(remaining_loop_time)


class CMSConfig(pydantic.BaseModel):
    url: str
    identity: str
    password: str


class Config(pydantic.BaseModel):
    cms: CMSConfig


with open(
    os.path.join(
        os.path.abspath(os.path.dirname(__file__)),
        "config.json",
    ),
    "r",
) as f:
    config = Config(**json.load(f))


class CMS:
    def __init__(self) -> None:
        self.auth_token = self.login()

    def login(self) -> str:
        r = requests.post(
            config.cms.url + "/api/collections/users/auth-with-password",
            data={
                "identity": config.cms.identity,
                "password": config.cms.password,
            },
        )
        response = r.json()
        try:
            assert type(response) == dict and "token" in response
            token = response["token"]
            assert isinstance(token, str)
        except AssertionError:
            raise AssertionError(f"Failed to login: {r.text}")

        return token

    def get_day_record_ids(self, sensor_id: str, date: str) -> list[str]:
        with _ensure_min_section_duration(1 / MAX_REQUESTS_PER_SECONDS):
            filter_query = (
                f"filter=("
                + f"(sensor_id='{sensor_id}')%26%26"
                + f"(utc~'{date[:4]}-{date[4:6]}-{date[6:]}')"
                + ")&perPage=256"
            )
            r = requests.get(
                config.cms.url
                + f"/api/collections/measurements/records?{filter_query}",
                headers={"Authorization": f"Bearer {self.auth_token}"},
            )
            assert r.status_code == 200, f"Failed to get record ids: {r.text}"
            return list(sorted([item["id"] for item in r.json()["items"]]))

    def create_record(
        self,
        sensor_id: str,
        record: tuple[
            datetime,
            float,
            float,
            float,
            float,
            float,
            float,
            float,
            float,
            float,
            float,
        ],
    ) -> None:
        with _ensure_min_section_duration(
            (1 / MAX_REQUESTS_PER_SECONDS) * THREAD_COUNT
        ):
            new_item = {
                "location_id": LOCATION_ID,
                "sensor_id": sensor_id,
                "raw": True,
                "utc": record[0].isoformat(),
                "gnd_p": round(record[1], 6),
                "gnd_t": round(record[2], 6),
                "app_sza": round(record[3], 6),
                "azimuth": round(record[4], 6),
                "xh2o": round(record[5], 6),
                "xair": round(record[6], 6),
                "xco2": round(record[7], 6),
                "xch4": round(record[8], 6),
                "xco": round(record[9], 6),
                "xch4_s5p": round(record[10], 6),
            }
            response = requests.post(
                config.cms.url + "/api/collections/measurements/records",
                json=new_item,
                headers={"Authorization": f"Bearer {self.auth_token}"},
            )
            assert (
                response.status_code == 200
            ), f"Failed to create record: {response.text}, {new_item}"

    def delete_record(self, record_id: str) -> None:
        with _ensure_min_section_duration(
            (1 / MAX_REQUESTS_PER_SECONDS) * THREAD_COUNT
        ):
            response = requests.delete(
                config.cms.url + f"/api/collections/measurements/records/{record_id}",
                headers={"Authorization": f"Bearer {self.auth_token}"},
            )
            assert (
                response.status_code == 204
            ), f"Failed to delete record: {response.text}, {record_id}"

    def upload_dataframe(self, sensor_id: str, date: str, df: pl.DataFrame) -> None:
        thread_pool = multiprocessing.Pool(THREAD_COUNT)

        try:
            while True:
                existing_record_ids = self.get_day_record_ids(sensor_id, date)
                if len(existing_record_ids) == 0:
                    print("    done deleting existing records left")
                    break

                print(f"    deleting {len(existing_record_ids)} existing records")
                thread_pool.map(self.delete_record, existing_record_ids)

            print(f"    uploading {len(df)} new records")
            thread_pool.starmap(
                self.create_record, [(sensor_id, row) for row in df.iter_rows()]
            )

            print("    done uploading new records")
            thread_pool.close()
        except KeyboardInterrupt:
            thread_pool.terminate()
            thread_pool.close()
            raise


if __name__ == "__main__":
    cms = CMS()

    for sensor_id in SENSOR_IDS:
        data_dir = (
            f"{BASE_DIR}/{sensor_id}/proffast-{PROFFAST_VERSION}-outputs/successful"
        )
        for date in sorted(os.listdir(data_dir)):
            csv_path = f"{data_dir}/{date}/comb_invparms_ma_SN{SERIAL_NUMBERS[sensor_id]}_{date[2:]}-{date[2:]}.csv"
            if not os.path.exists(csv_path):
                continue
            print(f"Uploading {sensor_id}/{date}")
            df = tum_esm_utils.files.load_raw_proffast_output(csv_path)
            cms.upload_dataframe(sensor_id, date, df)
