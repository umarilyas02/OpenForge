# Build from the monorepo root:
#   docker build -f apps/cms-renderer/Dockerfile -t openforge-cms-renderer .
#
# Dokploy (or any Dockerfile-based platform): set the Docker Context Path to
# the repository root and the Dockerfile Path to apps/cms-renderer/Dockerfile.

FROM node:24-alpine AS base
RUN corepack enable
WORKDIR /repo

FROM base AS deps
COPY . .
RUN corepack pnpm install --frozen-lockfile

FROM deps AS builder
RUN corepack pnpm --filter @openforge/cms-renderer build

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001 -G nodejs

COPY --from=builder /repo/apps/cms-renderer/.next/standalone ./
COPY --from=builder /repo/apps/cms-renderer/.next/static ./apps/cms-renderer/.next/static

USER nextjs
EXPOSE 3000
CMD ["node", "apps/cms-renderer/server.js"]
