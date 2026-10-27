# Private upload scanner

This service streams bytes to self-hosted ClamAV, not a public sample-sharing
scanner. It has no runtime npm dependencies and does not write documents to disk.
Do not log request bodies, bearer tokens or uploaded filenames.

1. Run `docker compose up --build -d` here with `PRIVATE_SCANNER_TOKEN` supplied by
   the host's secret manager (at least 32 random characters).
2. Put a private, authenticated HTTPS reverse proxy in front of localhost:8088.
   Enforce a 20MB body cap, request timeout and network allowlisting where
   possible. Never expose clamd port 3310. Use separate tokens per environment.
3. Configure Convex `PRIVATE_SCANNER_URL` as the HTTPS `/scan` endpoint and the
   matching `PRIVATE_SCANNER_TOKEN`. Neither value belongs in mobile public env.
4. Test clean fixtures, the harmless EICAR antivirus test string, stale definitions,
   incorrect credentials, oversized streams and scanner outages before enabling
   uploads. A clean result is not a guarantee against every possible threat.
5. Both images are pinned to the immutable digests verified in the local EICAR
   rehearsal. Review/update those digests regularly, keep definitions current,
   monitor memory/readiness and rotate the API token. The official ClamAV image
   currently uses amd64; deploy to an amd64 host rather than relying on emulation.
   Keep the scanner's ingress network behind the HTTPS reverse proxy; the scan
   network is internal and clamd has no published ports.

The API returns a clean/rejected verdict, SHA-256 of the exact bytes, engine
version and definition date. Uninspectable files, stale definitions, encryption,
archive limit violations and daemon failures must not produce a clean verdict.
The upload gateway requires a matching hash and fresh definitions before issuing
a clean receipt or allowing attachment to an application/case.

Hosting and TLS configuration are environment-specific. This repository does not
provision a server or claim that a scanner is running merely because files exist.

## Vercel Container Transport

Deploy this directory as an isolated scanner project using `vercel.json`. Its
explicit container service selects `Dockerfile.vercel`; do not rely on automatic
Dockerfile detection or deploy these rewrites into the website project. Vercel's
4.5 MB request limit makes the raw-byte transport unsuitable for large evidence.

Set a secret `PRIVATE_SCANNER_TOKEN` and `SCAN_SOURCE_URL` on that scanner project.
The source must be the matching environment's HTTPS Convex site endpoint ending
in `/secure-scan-source`. Configure Convex `PRIVATE_SCANNER_URL`, the same secret,
and `PRIVATE_SCANNER_TRANSPORT=fetch`. Never expose either credential through
`VITE_` or `EXPO_PUBLIC_` configuration. Use separate projects/secrets for production
and development.

The gateway stores an untrusted temporary blob and sends only a one-use capability,
size and checksum to the scanner. The scanner fetches from its fixed source, checks
the exact byte count/hash, and inspects those bytes with ClamAV. It accepts no
caller-provided URL and exposes no file download endpoint. Only clean results
become attachable receipts; failed/rejected temporary files are deleted with a
bounded retry cron. Accepted original evidence is not recompressed or deleted.

The container listens immediately, but initializes the antivirus engine lazily
after an authenticated scan request. Unauthorized requests cannot trigger engine
startup or definition downloads. Startup refreshes definitions, retries failures
after a cooldown, and rejects unavailable or stale engines. Definitions live in
temporary storage; daemon port 3310 binds only to localhost. Monitor cold-start
latency, memory, signature freshness and cleanup failures before production use.

On 2026-10-08 the isolated `haki-yangu-private-scanner-dev` project was deployed
for synthetic development rehearsals. This is not the live LSF website or a
production upload scanner. See the dated environment report for tested results.
