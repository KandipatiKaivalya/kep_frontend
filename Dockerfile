# Step 1: Use Node.js as the base image
FROM node:18-alpine

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy package files and install dependencies
# This is done first to take advantage of Docker's caching
COPY package.json package-lock.json ./
RUN npm install

# Step 4: Copy the rest of your frontend source code
COPY . .

# Step 5: Expose port 80 (to match your docker-compose.yml)
EXPOSE 80

# Step 6: Start the Vite development server
# --host 0.0.0.0 allows access from outside the container
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "80"]