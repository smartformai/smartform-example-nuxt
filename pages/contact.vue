<script setup lang="ts">
const status = ref('');

async function onSubmit(e: Event) {
  e.preventDefault();
  status.value = 'Sending…';
  const data = Object.fromEntries(new FormData(e.currentTarget as HTMLFormElement));
  try {
    const body = await $fetch('/api/contact', { method: 'POST', body: data });
    status.value = `Sent! submission_id=${(body as any).submission_id} intent=${(body as any).intent}`;
  } catch (err: any) {
    status.value = `Error: ${err.message}`;
  }
}
</script>

<template>
  <main style="font: 16px/1.4 system-ui; max-width: 480px; margin: 40px auto;">
    <h1>Contact</h1>
    <form @submit="onSubmit" style="display: grid; gap: 12px;">
      <input name="name"  placeholder="Name"  required />
      <input name="email" type="email" placeholder="Email" required />
      <textarea name="message" placeholder="Message" required style="min-height: 100px;"></textarea>
      <input type="text" name="_gotcha" tabindex="-1" autocomplete="off"
             style="position: absolute; left: -9999px;" aria-hidden="true" />
      <button type="submit" style="background: #7c3aed; color: #fff; border: 0; padding: 8px 10px;">Send</button>
      <p>{{ status }}</p>
    </form>
  </main>
</template>
