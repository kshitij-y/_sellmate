# Stage 1: Builder
FROM node:20-alpine AS builder

WORKDIR /frontend

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /frontend

COPY --from=builder /frontend/.next/standalone ./
COPY --from=builder /frontend/.next/static ./.next/static
COPY --from=builder /frontend/package.json ./package.json
COPY --from=builder /frontend/package-lock.json ./package-lock.json
COPY --from=builder /frontend/public ./public

ENV PORT=3001
EXPOSE 3001

CMD ["node", "server.js"]
