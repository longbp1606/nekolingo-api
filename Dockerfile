# Build with Yarn
FROM node:20 AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install
COPY . .
RUN pnpm build

FROM node:20 AS runner
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --prod
COPY --from=builder /app/dist ./
CMD ["node", "main"]