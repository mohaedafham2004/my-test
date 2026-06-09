#!/bin/sh
set -e

echo ">>> Pushing schema to database..."
npx prisma db push --accept-data-loss

echo ">>> Seeding database (skipped if already seeded)..."
if [ -f "dist/prisma/seed.js" ]; then
  node dist/prisma/seed.js || true
elif [ -f "dist/seed.js" ]; then
  node dist/seed.js || true
else
  echo "No compiled seed file found, skipping."
fi

echo ">>> Starting TripCast backend..."
if [ -f "dist/src/main.js" ]; then
  exec node dist/src/main.js
else
  exec node dist/main.js
fi
