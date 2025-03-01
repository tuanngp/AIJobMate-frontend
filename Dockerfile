# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
# Copy package.json và lock file để tận dụng caching
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
# Copy toàn bộ mã nguồn
COPY . .
# Build Next.js app
RUN yarn build

# Production stage
FROM node:18-alpine
WORKDIR /app
# Copy chỉ những file cần thiết từ build stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
# Thiết lập biến môi trường production
ENV NODE_ENV=production
# Mở port 3000 (mặc định của Next.js)
EXPOSE 3000
# Chạy ứng dụng
CMD ["yarn", "start"]