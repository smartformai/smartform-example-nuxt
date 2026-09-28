export default defineEventHandler(async (event) => {
  const body   = await readBody(event);
  const config = useRuntimeConfig();

  return await $fetch(`${config.smartformEndpoint}/api/v1/f/${config.smartformFormId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body,
  });
});
