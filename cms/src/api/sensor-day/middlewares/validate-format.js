"use strict";

function assertTimeseriesFormat(count, ts, prefix) {
  const assert = (condition, message) => {
    if (!condition) {
      throw `${message}`;
    }
  };

  assert(ts !== undefined);
  assert(Array.isArray(ts.xs), `${prefix}Timeseries.xs has to be an array`);
  assert(Array.isArray(ts.ys), `${prefix}Timeseries.ys has to be an array`);

  assert(typeof count === "number", `${prefix}Count has to be a number`);
  assert(
    count === ts.xs.length,
    `${prefix}Count has to be equal to ${prefix}Timeseries.xs.length`
  );
  assert(
    ts.xs.length === ts.ys.length,
    `${prefix}Timeseries.xs.length has to be equal to ${prefix}Timeseries.ys.length`
  );

  for (let i = 0; i < ts.xs.length; i++) {
    assert(
      typeof ts.xs[i] === "number",
      `${prefix}Timeseries.xs can only contain numbers`
    );
    assert(
      typeof ts.ys[i] === "number",
      `${prefix}Timeseries.ys can only contain numbers`
    );
  }
}

function validateDataFormat(data) {
  try {
    assertTimeseriesFormat(
      data.filteredCount,
      data.filteredTimeseries,
      "filtered"
    );
    if (data.rawCount !== undefined) {
      assertTimeseriesFormat(data.rawCount, data.rawTimeseries, "raw");
    }
    if (data.flagCount !== undefined) {
      assertTimeseriesFormat(data.flagCount, data.flagTimeseries, "flag");
    }
    return true;
  } catch (e) {
    return e;
  }
}

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    const validation = validateDataFormat(ctx.request.body.data);
    if (validation === true) {
      await next();
    } else {
      console.log(validation);
      return ctx.badRequest(validation);
    }
  };
};
