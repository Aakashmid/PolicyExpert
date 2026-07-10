import os
from time import sleep
from celery import Celery
from celery.schedules import crontab
from datetime import timedelta

# Set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

app = Celery('core')


app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django apps.
app.autodiscover_tasks()


@app.task(name="addition_task")   # naming task 
def add(x,y):
    sleep(10)
    return x+y
