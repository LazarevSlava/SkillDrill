#!/usr/bin/env bash
set -Eeuo pipefail

REPO_DIR="/opt/skilldrill"
BRANCH="${1:-main}"

cd "$REPO_DIR"

echo ">>> Fetching $BRANCH"
git fetch --prune origin
git checkout "$BRANCH"
git reset --hard "origin/$BRANCH"

# Определяем, где лежит compose-файл
if [[ -f "docker-compose.yml" || -f "compose.yml" ]]; then
  COMPOSE_DIR="$REPO_DIR"
elif [[ -f "server/docker-compose.yml" || -f "server/compose.yml" ]]; then
  COMPOSE_DIR="$REPO_DIR/server"
else
  echo "No docker-compose.yml / compose.yml found" >&2
  exit 1
fi

cd "$COMPOSE_DIR"

echo ">>> Build & deploy API"
docker compose pull || true
docker compose build api
docker compose up -d --remove-orphans

echo ">>> Cleanup dangling images"
docker image prune -f >/dev/null 2>&1 || true

echo ">>> Done. Current containers:"
docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}"
