from datetime import datetime
import os
import tum_esm_utils
import src
import rich.console
import rich.progress
import tum_esm_em27_metadata

PROJECT_DIR = tum_esm_utils.files.get_parent_dir_path(__file__, current_depth=1)
LOG_DIR = f"{PROJECT_DIR}/logs"
if not os.path.isdir(LOG_DIR):
    os.makedirs(LOG_DIR)

with open(
    f"{LOG_DIR}/run-{datetime.utcnow().isoformat(timespec='seconds')}.ansi", "a"
) as f:
    console = rich.console.Console(color_system="standard", file=f)
    config = src.config.Config.load()
    location_data = tum_esm_em27_metadata.load_from_github(
        **config.location_data.dict()
    )

    for sensor_id in config.data.sensors_to_consider:
        console.print(
            f"Processing data from sensor {sensor_id}", style="bold deep_pink3"
        )

        sensor_data_loader = src.data.SensorDataLoader(sensor_id, location_data)
        pocketbase = src.pocketbase.PocketBase()

        # only returns dates that have not been uploaded yet
        # prints out the number of new and cached dates
        new_dates = sensor_data_loader.get_new_dates(console)

        with rich.progress.Progress(console=console, auto_refresh=False) as progress:
            task = progress.add_task(
                f"Uploading data of {sensor_id}", total=len(new_dates)
            )
            date_count = len(new_dates)
            for i, date in enumerate(new_dates):
                console.print(
                    f"  Uploading [blue]{sensor_id}/{date}[/blue] ({datetime.utcnow().isoformat(timespec='seconds')} UTC) {i+1}/{date_count}",
                    style="bold bright_white",
                    highlight=False,
                )
                record = sensor_data_loader.get_date_record(date, console)
                pocketbase.upload_record(sensor_id, date, record, console)
                progress.update(task, advance=1, refresh=True)
                sensor_data_loader.add_date_to_cache_list(date)
