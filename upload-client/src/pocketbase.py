from typing import Any, Optional
import requests
import multiprocessing
import src
import rich.console


class PocketBase:
    def __init__(self) -> None:
        self.config = src.config.Config.load()
        self.headers = {"Authorization": f"Bearer {self.login()}"}
        self.endpoint = (
            self.config.cms.url + "/api/collections/bulk_measurements/records"
        )

        self.thread_count = self.config.networking.thread_count
        self.min_seconds_per_request = (
            1 / self.config.networking.max_requests_per_seconds
        )

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

    def get_existing_record_id(self, sensor_id: str, date: str) -> Optional[str]:
        with src.utils.ensure_min_section_duration(self.min_seconds_per_request):
            filter_query = (
                f"filter=("
                + f"(sensor_id='{sensor_id}')%26%26"
                + f"(utc_date='{date[:4]}-{date[4:6]}-{date[6:]}')"
                + ")"
            )
            r = requests.get(
                f"{self.endpoint}?{filter_query}",
                headers=self.headers,
            )
            assert r.status_code == 200, f"Failed to get record ids: {r.text}"

            item_ids: list[str] = [item["id"] for item in r.json()["items"]]
            if len(item_ids) == 0:
                return None
            elif len(item_ids) == 1:
                return item_ids[0]
            else:
                raise AssertionError(
                    f"Found multiple records for sensor_id={sensor_id}, date={date}"
                )

    def create_record(self, new_record: dict[Any, Any]) -> None:
        with src.utils.ensure_min_section_duration(self.min_seconds_per_request):
            response = requests.post(
                self.endpoint,
                json=new_record,
                headers=self.headers,
            )
            assert (
                response.status_code == 200
            ), f"Failed to create record: {response.text}, {new_record}"

    def delete_record(self, record_id: str) -> None:
        with src.utils.ensure_min_section_duration(self.min_seconds_per_request):
            response = requests.delete(
                f"{self.endpoint}/{record_id}",
                headers=self.headers,
            )
            assert (
                response.status_code == 204
            ), f"Failed to delete record: {response.text}, {record_id}"

    def upload_record(
        self,
        sensor_id: str,
        date: str,
        record: dict[Any, Any],
        console: rich.console.Console,
    ) -> None:
        existing_record_id = self.get_existing_record_id(sensor_id, date)
        if existing_record_id is not None:
            console.print(
                f"    deleting the existing record",
                style="grey78",
                highlight=False,
            )
            self.delete_record(existing_record_id)
        else:
            console.print(
                f"    no existing record found",
                style="grey78",
                highlight=False,
            )
        console.print(
            f"    uploading the new record",
            style="grey78",
            highlight=False,
        )
        self.create_record(record)
