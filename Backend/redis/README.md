# How to start

Step 1:

```bash
docker build -t custom-redis .
```

Step 2:

```bash
docker run -d --name redis-container -p 6379:6379 -v redis-data:/data custom-redis
```
