# Build from the monorepo root:
#   docker build -f apps/cms-admin/Dockerfile -t openforge-cms-admin .
#
# Dokploy (or any Dockerfile-based platform): set the Docker Context Path to
# the repository root and the Dockerfile Path to apps/cms-admin/Dockerfile.
#
# Requires at minimum DATABASE_URL at runtime (see
# envs/examples/cms-admin.env.example for the full list, incl.
# SITES_STORAGE_PATH -- mount that path as a persistent volume, since it
# holds every site's real project files). ENCRYPTION_MASTER_KEY is only
# required to use Settings > GitHub.

FROM node:24-alpine AS base
RUN corepack enable
WORKDIR /repo

FROM base AS deps
COPY . .
RUN corepack pnpm install --frozen-lockfile

FROM deps AS builder
# pnpm's own recursive "..." filter builds @openforge/cms-admin and every
# workspace dependency it needs first, in dependency order (incl.
# @openforge/cms-blocks, whose own build step generates the gitignored
# dist/standalone/ that cms-admin's next.config.js reads via
# outputFileTracingIncludes). Deliberately not `turbo run build --filter=...`:
# on this Node/Alpine/pnpm combination turbo tries to spawn each task via a
# package-relative `./node_modules/.bin/pnpm`, which pnpm's workspace layout
# never creates per-package (only the repo root gets that symlink) -- every
# task fails immediately with "unable to spawn child process: No such file
# or directory", confirmed by testing both paths directly in this image.
RUN corepack pnpm --filter "@openforge/cms-admin..." run build

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3903
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001 -G nodejs

COPY --from=builder /repo/apps/cms-admin/.next/standalone ./
COPY --from=builder /repo/apps/cms-admin/.next/static ./apps/cms-admin/.next/static

RUN mkdir -p /app/data/sites && chown -R nextjs:nodejs /app/data
VOLUME ["/app/data/sites"]

USER nextjs
EXPOSE 3903
CMD ["node", "apps/cms-admin/server.js"]
