from typing import Any
import requests
import polars as pl
import multiprocessing
import src

THREAD_COUNT = 32
MAX_REQUESTS_PER_SECONDS = 45
MIN_SECONDS_PER_REQUEST = 1 / MAX_REQUESTS_PER_SECONDS


class PocketBase:
    def __init__(self) -> None:
        self.config = src.config.Config.load()
        self.headers = {"Authorization": f"Bearer {self.login()}"}
        self.endpoint = self.config.cms.url + "/api/collections/measurements/records"

    def login(self) -> str:
        r = requests.post(
            self.config.cms.url + "/api/collections/users/auth-with-password",
            data={
                "identity": self.config.cms.identity,
                "password": self.config.cms.password,
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
        with src.utils.ensure_min_section_duration(MIN_SECONDS_PER_REQUEST):
            # only supports up to 500 items per page
            filter_query = (
                f"filter=("
                + f"(sensor_id='{sensor_id}')%26%26"
                + f"(utc~'{date[:4]}-{date[4:6]}-{date[6:]}')"
                + ")&perPage=256"
            )
            r = requests.get(
                f"{self.endpoint}?{filter_query}",
                headers=self.headers,
            )
            assert r.status_code == 200, f"Failed to get record ids: {r.text}"

            item_ids: list[str] = [item["id"] for item in r.json()["items"]]
            page_count: int = r.json()["totalPages"]

        for i in range(1, page_count):
            with src.utils.ensure_min_section_duration(MIN_SECONDS_PER_REQUEST):
                r = requests.get(
                    f"{self.endpoint}?{filter_query}&page={i+1}",
                    headers=self.headers,
                )
                assert r.status_code == 200, f"Failed to get record ids: {r.text}"
                item_ids += [item["id"] for item in r.json()["items"]]

        return item_ids

    def create_record(self, new_record: dict[Any, Any]) -> None:
        with src.utils.ensure_min_section_duration(
            MIN_SECONDS_PER_REQUEST * THREAD_COUNT
        ):
            response = requests.post(
                self.endpoint,
                json=new_record,
                headers=self.headers,
            )
            assert (
                response.status_code == 200
            ), f"Failed to create record: {response.text}, {new_record}"

    def delete_record(self, record_id: str) -> None:
        with src.utils.ensure_min_section_duration(
            MIN_SECONDS_PER_REQUEST * THREAD_COUNT
        ):
            response = requests.delete(
                f"{self.endpoint}/{record_id}",
                headers=self.headers,
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
