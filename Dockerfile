FROM oven/bun:1.2.0 AS base
WORKDIR /app
RUN bun install @nestjs/cli -g

# Ensure bun user has permissions to modify /app and /tmp
RUN chown -R bun:bun /app /tmp && chmod -R 777 /app /tmp

# install dependencies
FROM base AS build
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# build app
# ENV NODE_ENV=production
COPY tsconfig.json tsconfig.build.json ./
COPY src/ src/
RUN bun run build

# copy dist and start app
FROM base AS app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules

USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "dist/main.js" ]
