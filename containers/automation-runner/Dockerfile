# ============================================
# Build Stage - Install dependencies
# ============================================
FROM node:22-bookworm AS build

WORKDIR /app

# Install system dependencies for native modules
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package.json package*.json* ./

# Install Node.js dependencies
RUN npm ci --omit=dev || npm install --omit=dev

# Copy evaluation configs
COPY eval/ ./eval/

# ============================================
# Runtime Stage - Distroless for security
# ============================================
FROM gcr.io/distroless/nodejs22-debian12:nonroot

WORKDIR /work

# Copy Node.js runtime and modules from build stage
COPY --from=build /usr/local/bin/node /usr/local/bin/node
COPY --from=build /app/node_modules /usr/local/lib/node_modules

# Copy entrypoint script
COPY --chown=nonroot:nonroot containers/automation-runner/entrypoint.sh /entrypoint.sh

# Set environment
ENV NODE_PATH=/usr/local/lib/node_modules
ENV PATH=/usr/local/bin:$PATH

# Use non-root user (distroless default)
USER nonroot

# Default command
ENTRYPOINT ["/entrypoint.sh"]
CMD ["node", "--version"]
