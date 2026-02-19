# nestjs-nutrigo-backend/Dockerfile

# Use a Node.js image compatible with your project
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Generate Prisma Client (Important for NestJS + Prisma)
RUN npx prisma generate

# Expose the port the app runs on
EXPOSE 3000

# Start the application in development mode
CMD ["npm", "run", "start:dev"]
