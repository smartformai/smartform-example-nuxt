# Nuxt 3 contact form — Formspree alternative with AI spam filtering

Contact form for Nuxt 3, posting JSON to SmartForm AI via a server route.

## Setup

1. Get a form ID at https://usesmartform.com/dashboard.
2. Clone, install, configure, run:
   ```bash
   git clone https://github.com/yanghuai123456/smartform-example-nuxt.git
   cd smartform-example-nuxt
   npm install
   # edit nuxt.config.ts → runtimeConfig.smartformFormId
   npm run dev
   ```
3. Open http://localhost:3000/contact, submit, check your dashboard.

## The server route

`server/api/contact.post.ts` handles the POST and forwards to SmartForm:

```ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const config = useRuntimeConfig();
  const r = await $fetch.raw(`${config.smartformEndpoint}/api/v1/f/${config.smartformFormId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body,
  });
  return r._data;
});
```

`pages/contact.vue` is a normal HTML form that POSTs to `/api/contact`.

## How the API works

- `POST {endpoint}/api/v1/f/{form_id}` — JSON or form-data, no API key.
- Response: `{ success, message, submission_id, is_spam, intent, next_url }`.

For the full contract, see https://usesmartform.com/docs.

## Deploy

```bash
npm run build         # ./.output
# Push to Node host, Vercel, Netlify, or Cloudflare Workers (with the right preset)
```

Set `NUXT_SMARTFORM_FORM_ID` and `NUXT_SMARTFORM_ENDPOINT` in your hosting env.
## Related examples
[Next.js contact form](https://github.com/yanghuai123456/smartform-example-nextjs) | [SvelteKit contact form](https://github.com/yanghuai123456/smartform-example-sveltekit) | [Astro contact form](https://github.com/yanghuai123456/smartform-example-astro)


## FAQ

### Why use this instead of Formspree?

Both SmartForm and Formspree let you POST a plain HTML form to a hosted
endpoint with no backend. SmartForm adds an AI spam filter (not just
honeypots), AI intent classification (`sales` / `support` / `inquiry`)
and high-value lead detection, with a free tier that includes the spam
filter. Formspree charges per submission; SmartForm's spam filter is
free on every plan.

### Is there a free tier?

Yes. AI spam filtering is enabled by default on every plan. AI intent
classification and high-value lead detection require a paid plan (Pro
or Business) — the dashboard enforces this and returns HTTP 402 if
you try to enable them on a free workspace.

### Do I need an API key?

No. The form posts directly to a public endpoint using only an 8-char
form ID, which is non-enumerable. The example also includes a hidden
`_gotcha` honeypot field so naive bots cannot submit.

### Do I need a Nuxt server?
Not necessarily. Two variants are included: a Nuxt 3 server route (Nitro) that hides the form ID, and a static, zero-JS plain form for fully static builds.

## Related examples
[Next.js contact form](https://github.com/yanghuai123456/smartform-example-nextjs) | [SvelteKit contact form](https://github.com/yanghuai123456/smartform-example-sveltekit) | [Astro contact form](https://github.com/yanghuai123456/smartform-example-astro)


## License

MIT.

