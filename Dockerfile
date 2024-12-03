# Use the official Node.js image from the Docker Hub as a base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the React app will run on (default React dev server port is 3000)
EXPOSE 3000

# Start the React app in development mode
CMD ["npm", "start"]
