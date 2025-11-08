# Middlewares Demo Stack

## Overview
This repository provisions a small middleware-focused demo built with Docker Compose. It wires together two Node.js services with multiple proxy layers to showcase request routing, caching, correlation IDs, and rate limiting.

## Architecture
The stack contains the following containers:

| Layer | Service | Description |
| ----- | ------- | ----------- |
| Edge | **Kong** (`kong`) | API gateway that enforces rate limiting and propagates `X-Request-ID` headers. |
| Load balancing | **HAProxy** (`haproxy`) | Forwards traffic to NGINX, validating its own configuration on boot. |
| Reverse proxies | **NGINX** (`nginx-core`, `nginx-edge`) | Caches responses and fans out to backend services. |
| Backends | **client-svc**, **account-svc** | Simple Express servers exposing health checks and demo endpoints, including a slow endpoint to show timeout behavior. |

Containers are grouped on two Docker networks:

- `edge`: public-facing components (Kong, HAProxy, `nginx-edge`).
- `core`: internal communication between NGINX and the Node.js services.

## Prerequisites
- Docker 20.10+
- Docker Compose v2 plugin

## Usage
1. Build and start the stack:
   ```bash
   docker compose up --build
   ```
2. Access the sample routes once the stack is healthy:
   ```bash
   # Public entrypoint through Kong on :8000
   curl -i http://localhost:8000/client/
   curl -i http://localhost:8000/account/

   # Call the slow endpoint to observe caching behavior
   curl -i http://localhost:8000/account/slow
   ```
3. Kong exposes its admin API on `http://localhost:8001` for inspecting configured services and routes.

To stop the demo, press `Ctrl+C` in the Compose session and run `docker compose down`.

## Notable Configuration
- Kong configuration (`kong/kong.yaml`) enables rate limiting (120 requests/minute) and request ID propagation.
- HAProxy and NGINX configs live in `haproxy/haproxy.cfg` and `nginx/*.conf`; they include health checks for upstream services.
- Each Node.js service defines its own Dockerfile and health check (see `account-svc` and `client-svc`).

## Next Steps
Consider these enhancements when extending the demo:
- Add explicit upstream timeouts in `nginx/reverse-proxy.conf` to handle slow endpoints deterministically.
- Introduce structured request logging (e.g., `morgan`) in the Node services.
- Parameterize ports and rate limits via environment variables for easier customization.
- Add automated tests (e.g., `supertest`) to validate the service endpoints and proxy flows.

## Repository Hygiene
The root `.gitignore` excludes `node_modules/` and common OS artifacts. Add similar ignores to subprojects as needed.
