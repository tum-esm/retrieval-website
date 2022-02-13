"use strict";

const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = createCoreRouter("api::sensor-day.sensor-day", {
  config: {
    create: {
      middlewares: [
        "api::sensor-day.validate-format",
        "api::sensor-day.remove-old-timeseries",
      ],
    },
  },
});
