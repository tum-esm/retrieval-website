from contextlib import contextmanager
import time
import numpy as np
import polars as pl
from typing import Generator
from scipy.signal import savgol_filter


SAMPLING_RATE = "2m"
MAX_INTERPOLATION_GAP_SECONDS = 300  # 5 minutes


@contextmanager
def ensure_min_section_duration(duration: float) -> Generator[None, None, None]:
    start_time = time.time()
    yield
    remaining_loop_time = start_time + duration - time.time()
    if remaining_loop_time > 0:
        time.sleep(remaining_loop_time)


def post_process_dataframe(df: pl.DataFrame) -> pl.DataFrame:
    """Post-processes the dataframe.

    It will resample the data to the required sampling rate using the savgol_filter. It will interpolate missing values up to the MAX_DELTA_FOR_INTERPOLATION timespan.

    `df` is the output of get_sensor_dataframe (see above). Example:

    ```
                            me_gnd_p  me_gnd_t  me_app_sza  ...
    utc
    2021-10-20 07:00:23     950.91    289.05       78.45     ...
    2021-10-20 07:00:38     950.91    289.05       78.42     ...
    2021-10-20 07:01:24     950.91    289.05       78.31     ...
    ...                       ...       ...         ...
    [1204 rows x 8 columns]
    ```

    ✗ `get_daily_dataframe` (see below) will be called afterwards and joins the dataframes on "utc".
    """

    if len(df) < 31:
        return df

    # add rows with only nan values in gaps larger than the
    # MAX_DELTA_FOR_INTERPOLATION timespan. This is necessary
    # because the savgol_filter does not consider gap size but
    # only the size of the window. I.e. a data point that is
    # 2 hours away from the current data point should not
    # influence the smoothed value of the current data point
    # even if that point is the next point.

    df = df.sort("utc")

    lower_utc_bound: pl.Datetime = (
        df.select(pl.min("utc") - pl.duration(seconds=1)).to_series().to_list()[0]
    )
    upper_utc_bound: pl.Datetime = (
        df.select(pl.max("utc") + pl.duration(seconds=1)).to_series().to_list()[0]
    )
    utcs_in_gaps: list[pl.Datetime] = (
        df.select(pl.col("utc"))
        .with_columns(pl.col("utc").diff().alias("dutc"))
        .filter(pl.col("dutc") > pl.duration(seconds=MAX_INTERPOLATION_GAP_SECONDS))
        .select(pl.col("utc") - pl.duration(seconds=1))
        .to_series()
        .to_list()
    )
    new_utc_rows = [lower_utc_bound] + utcs_in_gaps + [upper_utc_bound]

    new_df = pl.DataFrame(
        {
            "utc": new_utc_rows,
            **{
                column_name: [np.nan] * len(new_utc_rows)
                for column_name in df.columns
                if column_name != "utc"
            },
        },
        schema={
            "utc": pl.Datetime,
            **{
                column_name: pl.Float32
                for column_name in df.columns
                if column_name != "utc"
            },
        },
    )

    df = pl.concat([df, new_df]).sort("utc")

    # apply savgol_filter on the data columns
    df = df.select(
        pl.col("utc"),
        pl.exclude("utc")
        .map(lambda x: savgol_filter(x.to_numpy(), 31, 3).tolist())
        .arr.explode(),
    )

    # Upscale to 1s intervals and interpolate when the gaps
    # are smaller than the MAX_DELTA_FOR_INTERPOLATION. Finally,
    # downsample to the required sampling rate with a mean
    # aggregation on the data columns.
    df = (
        df.with_columns(
            (
                pl.col("utc") - pl.col("utc").shift()
                < pl.duration(seconds=MAX_INTERPOLATION_GAP_SECONDS)
            ).alias("small_gap")
        )
        .upsample(time_column="utc", every="1s")
        .with_columns(pl.col("small_gap").backward_fill())
        .with_columns(
            pl.when(pl.col("small_gap"))
            .then(pl.exclude(["small_gap"]).interpolate())
            .otherwise(pl.exclude(["small_gap"]))
        )
        .select(pl.exclude("small_gap"))
        .set_sorted("utc")
        .groupby_dynamic("utc", every=SAMPLING_RATE)
        .agg(pl.exclude("utc").mean())
    )

    data_column_names = df.columns
    data_column_names.remove("utc")
    df_without_null_rows = df.filter(~pl.all(pl.col(data_column_names).is_nan()))

    return df_without_null_rows
