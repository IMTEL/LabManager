#!/bin/sh

set -e

npx --yes prisma migrate deploy

exec "$@"