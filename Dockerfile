# 1) Base image yang ringan
FROM node:22-alpine AS base
WORKDIR /app
ENV NODE_ENV=production

# 2) Layer dependencies (maksimalkan cache)
FROM base AS deps
# Aktifkan Corepack agar Yarn Berry tersedia
RUN corepack enable
# Salin file yang diperlukan untuk install dependencies
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn/ .yarn/
# Install sesuai lockfile (immutable)
RUN yarn install --immutable

# 3) Build aplikasi
FROM deps AS build
# Public env untuk client bundle (ditanam saat build)
ARG NEXT_PUBLIC_BASE_API_URL
ENV NEXT_PUBLIC_BASE_API_URL=${NEXT_PUBLIC_BASE_API_URL}

# Salin source code
COPY . .
# Build Next.js
RUN yarn build

# 4) Runtime image yang ramping
FROM base AS runner
# Pastikan corepack/yarn aktif saat runtime (sebagai root)
RUN corepack enable
# Non-root user
RUN addgroup -S nextjs && adduser -S nextjs -G nextjs

# Salin artefak build
COPY --chown=nextjs:nextjs --from=build /app/package.json ./package.json
COPY --chown=nextjs:nextjs --from=build /app/public ./public
COPY --chown=nextjs:nextjs --from=build /app/.next ./.next

# Salin dependency runtime (nodeLinker: node-modules)
COPY --chown=nextjs:nextjs --from=deps /app/node_modules ./node_modules
COPY --chown=nextjs:nextjs --from=deps /app/.yarn/ ./.yarn/
COPY --chown=nextjs:nextjs --from=deps /app/.yarnrc.yml ./.yarnrc.yml
COPY --chown=nextjs:nextjs --from=deps /app/yarn.lock ./yarn.lock

# Beralih ke user non-root
USER nextjs

# Runtime env (server membaca dari sini; client memakai nilai saat build)
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV NEXT_PUBLIC_BASE_API_URL=""

EXPOSE 3000

# Jalankan Next.js production server
CMD ["yarn", "start"]
