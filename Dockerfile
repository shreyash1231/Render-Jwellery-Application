############################
# BUILD STAGE
############################
FROM node:22-bullseye AS builder

# Set working directory
WORKDIR /app

# Install system dependencies required for native modules (argon2 etc.)
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy package files first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm install --build-from-source=argon2

# Copy EVERYTHING from repo (build, admin, services, etc.)
COPY . .

############################
# RUNTIME STAGE
############################
FROM node:22-bullseye-slim

# Set working directory
WORKDIR /app

# Copy built app + node_modules from builder
COPY --from=builder /app /app

# Expose application port
EXPOSE 5000

# Start application
CMD ["node", "server.js"]
