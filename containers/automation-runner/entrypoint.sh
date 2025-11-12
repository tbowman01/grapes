#!/usr/bin/env bash
set -euo pipefail

# Entrypoint for GRAPES automation runner container
# This script ensures the working directory is set correctly
# and executes the provided command

# Set working directory
cd /work

# Execute the command passed to the container
exec "$@"
