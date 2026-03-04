# ─── Stage 1: builder ────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG NEXT_PUBLIC_DEFAULT_LANG=en
ENV NEXT_PUBLIC_DEFAULT_LANG=$NEXT_PUBLIC_DEFAULT_LANG

RUN npm run build


# ─── Stage 2: runner ─────────────────────────────────────────────────────────
FROM node:22-alpine AS runner

RUN apk add --no-cache libc6-compat

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

VOLUME ["/app/.sqlite"]

EXPOSE 3000

CMD ["node", "server.js"]
