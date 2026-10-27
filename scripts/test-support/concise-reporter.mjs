export default async function* report(source) {
  for await (const event of source) {
    if (event.type === 'test:fail') yield `FAIL ${event.data.name}: ${String(event.data.details.error?.cause?.message ?? event.data.details.error?.message ?? 'test failed').slice(0, 400)}\n`;
    if (event.type === 'test:summary') yield `SUMMARY ${JSON.stringify(event.data.counts)}\n`;
  }
}
