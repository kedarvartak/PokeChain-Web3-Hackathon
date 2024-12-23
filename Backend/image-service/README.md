## How to start

Make sure that redis is running on docker container

Step 1: Start celery

```bash
celery -A app.celery_app.celery_app worker --loglevel=info --pool=solo
```

Step 2: Start Flask Server

```bash
python run.py
```
