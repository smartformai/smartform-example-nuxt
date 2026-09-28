# Nuxt 3 contact form — Formspree alternative with AI spam filtering

Contact form for Nuxt 3, posting JSON to SmartForm AI via a server route.

## What you're POSTing

The endpoint accepts a standard HTML form POST or JSON via AJAX. Two
kinds of fields:

**Your form fields** — `name`, `email`, `message`, whatever you
want. Every non-reserved field lands in your dashboard as a column in
the submissions table.

**Reserved fields** — names starting with `_` are interpreted by
the API, not stored:

| Field | Purpose |
|---|---|
| ``_gotcha`` | **Honeypot.** Keep it empty. Hidden from humans via CSS; bots fill it automatically. Any non-empty value silently drops the submission. Add this to every form. |
| ``_hp_email`` / ``_website`` / ``_url`` / ``_phone`` | Honeypot aliases for `_gotcha` (WordPress / WPForms / Contact Form 7 migrations). Same drop semantics. |
| ``_next`` | Same-origin URL to redirect to after a successful submission. Browser POST results in a 302 here. AJAX calls (with `Accept: application/json`) get the same value back as `next_url` in the JSON response. Only http(s) and in-site paths allowed. |
| ``_subject`` | Override the AI-generated email subject line. Max 200 chars; control characters stripped. |
| `X-Gotcha` header | Same as `_gotcha` for JSON requests where you can't add a hidden form field. |

Field names are Formspree-compatible — migrating from
`formspree.io/f/{form_id}` requires no renaming.

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


## FAQ

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

