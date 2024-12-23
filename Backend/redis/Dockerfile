# Base image for Redis
FROM redis:latest

# Set the working directory inside the container
WORKDIR /data

# Expose Redis default port
EXPOSE 6379

# Set a default command to run Redis server
CMD ["redis-server", "--appendonly", "yes"]

