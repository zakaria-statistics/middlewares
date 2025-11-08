# Code Review: middlewares Stack

## Overview
The repository provisions a small microservices demo composed of two Node.js services (`client-svc`, `account-svc`), a pair of NGINX reverse proxies fronted by HAProxy, and a Kong API gateway. The stack is orchestrated through Docker Compose with emphasis on propagating `X-Request-ID`, caching, and rate limiting.

## Strengths
- **Clear service separation.** Each service exposes a minimal Express server with dedicated Dockerfiles and health checks. The Kong declarative configuration captures routing, correlation ID propagation, and rate limiting.
- **Layered networking.** Compose networks (`edge`, `core`) enforce separation between public gateway traffic and internal load-balanced hops.
- **Operational readiness.** Health checks are defined across Kong, HAProxy (configuration validation), NGINX, and the Node services, providing good observability hooks.

## Opportunities for Improvement
1. **Missing request timeouts between NGINX and services.**
   - `reverse-proxy.conf` relies on defaults for `proxy_connect_timeout`, `proxy_send_timeout`, and `proxy_read_timeout`, while the upstream `/slow` endpoint can take 4 seconds. Explicit upstream timeouts and retry logic (especially for `/account/`) would make failure handling more deterministic.
2. **Add structured logging or log rotation guidance.**
   - Both Express services log to stdout with `console.log`. Consider adding request logging middleware (e.g., `morgan`) or ensuring logs include severity levels. HAProxy is set to raw logs, but guidance on shipping or rotating logs would help in production.
3. **Introduce tests or contract checks.**
   - The Node services lack automated tests. Adding simple endpoint tests (using `supertest`) or contract validation would improve confidence when modifying behaviors like caching or error responses.
4. **Parameterize hard-coded ports and limits.**
   - Ports (`5001`, `5002`, `8000`, `8080`) and rate limits (120/min) are embedded directly in configuration files. Using environment variables (Compose `environment` entries) would make the stack easier to customize between environments.
5. **Document gateway usage and sample flows.**
   - A README describing how to bring the stack up, the expected request path (Kong → HAProxy → NGINX → services), and sample curl commands would ease onboarding.
6. **Consider enabling key authentication in Kong.**
   - The Kong config hints at API key support. Enabling and documenting it (with `consumers` and credentials) would better demonstrate securing the gateway.

## Hygiene Notes
- Added `.gitignore` entries for `node_modules/` to avoid committing dependencies.
- `docker-compose.yml` exposes Kong proxy on host port `8001`, which is unconventional; typically proxy uses `:8000` and admin on `:8001`. Confirm intent or update the published port/comment.

