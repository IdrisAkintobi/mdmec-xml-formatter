# Use specific Bun version for reproducible builds
FROM oven/bun:1.3.10 AS base
WORKDIR /app

# Ensure bun user has permissions to modify /app and /tmp
RUN chown -R bun:bun /app /tmp && chmod -R 777 /app /tmp

# Install dependencies
FROM base AS install
COPY package.json bun.lock bunfig.toml ./
RUN bun install --frozen-lockfile

# Build app using bun build:prod command
FROM base AS build
COPY --from=install /app/node_modules ./node_modules
COPY package.json bun.lock bunfig.toml ./
COPY tsconfig.json tsconfig.build.json ./
COPY src/ src/
ENV NODE_ENV=production
RUN bun run build:prod

# Production image
FROM base AS app
COPY --from=install /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./

USER bun
EXPOSE 3000/tcp
ENV NODE_ENV=production
ENV PORT=3000
ENTRYPOINT [ "bun", "run", "start:prod" ]
