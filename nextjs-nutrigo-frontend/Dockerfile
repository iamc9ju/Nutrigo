# frontend/Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

# รัน Next.js โหมด Dev
CMD ["npm", "run", "dev"]