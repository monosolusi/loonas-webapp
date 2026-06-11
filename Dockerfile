# 1) Base image yang ringan
FROM node:22-alpine AS base
WORKDIR /app
ENV NODE_ENV=production

# 2) Layer dependencies (semua, termasuk devDependencies untuk build)
FROM base AS deps
COPY package.json package-lock.json ./
# Install semua dependencies (dev + prod) untuk build.
# --include=dev overrides the inherited NODE_ENV=production so devDependencies
# (next, typescript, tailwind) are installed for the build stage.
RUN npm ci --ignore-scripts --include=dev

# 3) Build aplikasi
FROM deps AS build
# Public env untuk client bundle (ditanam saat build)
ARG NEXT_PUBLIC_BASE_API_URL
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_BASE_API_URL=${NEXT_PUBLIC_BASE_API_URL}
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=${NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}

# Salin source code
COPY . .
# Build Next.js
RUN npm run build

# 4) Runtime image yang ramping
FROM base AS runner
# Non-root user
RUN addgroup -S nextjs && adduser -S nextjs -G nextjs

# Salin artefak standalone build
COPY --from=build --chown=nextjs:nextjs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nextjs /app/.next/static ./.next/static
COPY --from=build --chown=nextjs:nextjs /app/public ./public

# Beralih ke user non-root
USER nextjs

# Runtime env (server membaca dari sini; client memakai nilai saat build)
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

EXPOSE 3000

# Healthcheck menggunakan Node built-in fetch (tanpa curl)
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

# Jalankan Next.js standalone server
CMD ["node", "server.js"]
