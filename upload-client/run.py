from datetime import datetime
import src
import rich.console
import rich.progress
import tum_esm_em27_metadata

console = rich.console.Console()
config = src.config.Config.load()
location_data = tum_esm_em27_metadata.load_from_github(**config.location_data.dict())

for sensor_id in config.data.sensors_to_consider:
    console.print(f"Processing data from sensor {sensor_id}", style="bold blue")

    sensor_data_loader = src.data.SensorDataLoader(sensor_id, location_data)
    pocketbase = src.pocketbase.PocketBase()

    # only returns dates that have not been uploaded yet
    # prints out the number of new and cached dates
    new_dates = sensor_data_loader.get_new_dates()

    with rich.progress.Progress(console=console, auto_refresh=False) as progress:
        task = progress.add_task(f"Uploading data of {sensor_id}", total=len(new_dates))
        for date in new_dates:
            console.print(
                f"  Uploading [blue]{date}[/blue] ({datetime.utcnow().isoformat(timespec='seconds')} UTC)",
                style="bold bright_white",
                highlight=False,
            )
            records = sensor_data_loader.get_date_records(date)
            pocketbase.upload_records(sensor_id, date, records, console)
            progress.update(task, advance=1, refresh=True)
            sensor_data_loader.add_date_to_cache_list(date)
