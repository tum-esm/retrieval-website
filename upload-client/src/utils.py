from contextlib import contextmanager
import time
from typing import Generator


@contextmanager
def ensure_min_section_duration(duration: float) -> Generator[None, None, None]:
    start_time = time.time()
    yield
    remaining_loop_time = start_time + duration - time.time()
    if remaining_loop_time > 0:
        time.sleep(remaining_loop_time)
