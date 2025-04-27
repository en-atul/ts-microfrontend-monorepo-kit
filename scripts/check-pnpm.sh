#!/bin/bash

# Ensure only pnpm is used
if grep -q "npm" package-lock.json; then
  echo "Error: 'npm' detected in package-lock.json. Please use 'pnpm' instead."
  exit 1
fi

if grep -q "yarn" yarn.lock; then
  echo "Error: 'yarn' detected in yarn.lock. Please use 'pnpm' instead."
  exit 1
fi

echo "All dependencies are using 'pnpm'."
exit 0