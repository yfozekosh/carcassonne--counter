# Use Node.js LTS as the base image
FROM node:20-alpine AS base

# Set working directory
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package.json ./
# Use legacy-peer-deps to handle dependency conflicts
RUN npm install --legacy-peer-deps

# Build the application
FROM deps AS builder
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

# Set environment variables with correct syntax
ENV NODE_ENV=production
ENV PORT=8080

# Copy necessary files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Expose the port the app will run on
EXPOSE 8080

# Start the application
CMD ["node", "server.js"]
