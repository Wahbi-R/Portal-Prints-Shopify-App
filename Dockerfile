# Use Node.js as the base image
FROM node:18-alpine

# Expose the app port
EXPOSE 3000

# Set the working directory
WORKDIR /app

# Set the environment to production
ENV NODE_ENV=production

# Copy package.json and lock file
COPY package.json package-lock.json* ./

# Install production dependencies
RUN npm ci --omit=dev && npm cache clean --force

# Remove Shopify CLI if not needed in production
RUN npm remove @shopify/cli

# Copy all source files into the container
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Ensure the SQLite file exists
RUN touch dev.sqlite

# Build the Remix app
RUN npm run build

# Command to start the app
CMD ["npm", "run", "docker-start"]
