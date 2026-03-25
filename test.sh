#!/usr/bin/env sh
set -e

echo "▶ Running backend tests..."
docker compose --profile test run --rm backend-test

echo "▶ Running frontend tests..."
docker compose --profile test run --rm frontend-test

echo "✅ All tests passed."
