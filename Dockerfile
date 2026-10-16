FROM python:3.12-slim-bookworm
LABEL org.opencontainers.image.title="brainsait-bpr-services"
RUN apt-get update \
 && apt-get install -y --no-install-recommends curl ca-certificates libpq5 \
 && rm -rf /var/lib/apt/lists/* \
 && pip install --no-cache-dir psycopg2-binary
WORKDIR /app
COPY services/ /app/services/
# Each compose service picks its own command (see docker-compose.yml):
#   python3 /app/services/bpr-<name>.py
HEALTHCHECK --interval=10s --timeout=5s --retries=3 \
  CMD python3 -c "import urllib.request,sys; urllib.request.urlopen('http://127.0.0.1:${port}/health'.replace('${port}','9642'))" 2>/dev/null || exit 1
