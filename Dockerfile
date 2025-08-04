# Build with Yarn
FROM node:22 AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN npm install -g pnpm
RUN pnpm install
COPY . .
RUN pnpm build

FROM node:22 AS runner
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN npm install -g pnpm
RUN pnpm install
COPY --from=builder /app/dist ./
CMD ["node", "main"]
