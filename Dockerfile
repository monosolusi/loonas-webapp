# 1) Base image yang ringan
FROM node:22-alpine AS base
WORKDIR /app
ENV NODE_ENV=production

# 2) Layer dependencies (maksimalkan cache)
FROM base AS deps
# Salin file yang diperlukan untuk install dependencies
COPY package.json package-lock.json ./
# Install sesuai lockfile
RUN npm ci

# 3) Build aplikasi
FROM deps AS build
# Public env untuk client bundle (ditanam saat build)
ARG NEXT_PUBLIC_BASE_API_URL
ENV NEXT_PUBLIC_BASE_API_URL=${NEXT_PUBLIC_BASE_API_URL}

# Salin source code
COPY . .
# Build Next.js
RUN npm run build

# 4) Runtime image yang ramping
FROM base AS runner
# Non-root user
RUN addgroup -S nextjs && adduser -S nextjs -G nextjs
# Install curl untuk healthcheck
RUN apk add --no-cache curl

# Salin artefak build
COPY --chown=nextjs:nextjs --from=build /app/package.json ./package.json
COPY --chown=nextjs:nextjs --from=build /app/public ./public
COPY --chown=nextjs:nextjs --from=build /app/.next ./.next

# Salin dependency runtime
COPY --chown=nextjs:nextjs --from=deps /app/node_modules ./node_modules

# Beralih ke user non-root
USER nextjs

# Runtime env (server membaca dari sini; client memakai nilai saat build)
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV NEXT_PUBLIC_BASE_API_URL=""

EXPOSE 3000

# Healthcheck untuk memonitor status aplikasi
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

# Jalankan Next.js production server
CMD ["npm", "start"]
