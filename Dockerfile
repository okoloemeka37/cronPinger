# Use Node LTS base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy files
COPY . .

# Install dependencies
RUN npm install

# Start the app
CMD ["node", "cron-pinger.js"]
