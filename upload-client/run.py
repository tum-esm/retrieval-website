import src
import rich.console
import rich.progress

console = rich.console.Console()
config = src.config.Config.load()

for sensor_id in config.data.sensors_to_consider:
    console.print(f"Processing data from sensor {sensor_id}", style="bold blue")
    sensor_data_loader = src.data.SensorDataLoader(sensor_id)
    pocketbase = src.pocketbase.PocketBase()

    # in the future this will only return dates that have not
    # been uploaded yet or changed since the last upload
    dates = sensor_data_loader.get_dates()

    with rich.progress.Progress(console=console, auto_refresh=False) as progress:
        task = progress.add_task("uploading", total=len(dates))
        for date in dates:
            records = sensor_data_loader.get_date_records(date)
            pocketbase.upload_records(sensor_id, date, records)
            progress.update(task, advance=1, refresh=True)
