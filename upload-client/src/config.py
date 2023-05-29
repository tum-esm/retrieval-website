from __future__ import annotations
import json
import os
import pydantic
import tum_esm_utils

_PROJECT_DIR = tum_esm_utils.files.get_parent_dir_path(__file__, current_depth=2)


class Config(pydantic.BaseModel):
    location_data: Config.LocationDataConfig
    data: Config.DataConfig
    cms: Config.CMSConfig
    networking: Config.NetworkingConfig

    class LocationDataConfig(pydantic.BaseModel):
        github_repository: str
        access_token: str

    class DataConfig(pydantic.BaseModel):
        sensors_to_consider: list[str]
        src_dir: str

    class CMSConfig(pydantic.BaseModel):
        url: str
        identity: str
        password: str

    class NetworkingConfig(pydantic.BaseModel):
        thread_count: int
        max_requests_per_seconds: float

    @staticmethod
    def load() -> Config:
        with open(os.path.join(_PROJECT_DIR, "config.json"), "r") as f:
            return Config(**json.load(f))


if __name__ == "__main__":
    print(Config.load())
