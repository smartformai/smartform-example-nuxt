export default defineNuxtConfig({
  runtimeConfig: {
    smartformEndpoint: process.env.NUXT_SMARTFORM_ENDPOINT || 'https://api.usesmartform.com',
    smartformFormId:   process.env.NUXT_SMARTFORM_FORM_ID   || 'f_replace_me',
  },
  nitro: { preset: 'node-server' },
});
