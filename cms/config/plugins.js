module.exports = ({ env }) => ({
  email: {
    config: {
      provider: "strapi-provider-email-postmark",
      providerOptions: {
        apiKey: env("POSTMARK_API_KEY"),
      },
      settings: {
        defaultMessageStream: "outbound",
        defaultFrom: "strapi@dostuffthatmatters.dev",
        defaultReplyTo: "moritz@dostuffthatmatters.dev",
      },
    },
  },
});
