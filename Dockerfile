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

# Set build timestamp from build arg
ARG BUILD_TIMESTAMP
ENV BUILD_TIMESTAMP=${BUILD_TIMESTAMP}

# Create or update the build info file
RUN echo "export const BUILD_TIMESTAMP = '${BUILD_TIMESTAMP}';" > config/build-info.js

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
