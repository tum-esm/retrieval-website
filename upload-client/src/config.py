from __future__ import annotations
import json
import os
import pydantic
import tum_esm_utils

_PROJECT_DIR = tum_esm_utils.files.get_parent_dir_path(__file__, current_depth=2)


class Config(pydantic.BaseModel):
    cms: Config.CMSConfig

    class CMSConfig(pydantic.BaseModel):
        url: str
        identity: str
        password: str

    def load() -> Config:
        with open(os.path.join(_PROJECT_DIR, "config.json"), "r") as f:
            return Config(**json.load(f))


if __name__ == "__main__":
    print(Config.load())
