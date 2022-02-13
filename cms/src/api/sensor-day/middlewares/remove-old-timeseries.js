"use strict";

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    const newObject = ctx.request.body.data;
    const existingObjects = await strapi.db
      .query("api::sensor-day.sensor-day")
      .findMany({
        select: ["id"],
        where: {
          date: newObject.date,
          spectrometer: newObject.spectrometer,
          location: newObject.location,
          gas: newObject.gas,
        },
      });
    existingObjects.forEach(async (o) => {
      await strapi.db
        .query("api::sensor-day.sensor-day")
        .delete({ where: { id: o.id } });
    });
    console.log(
      `${newObject.date}: removed ${existingObjects.length} old object(s)`
    );

    await next();
  };
};
