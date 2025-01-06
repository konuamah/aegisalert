# tasks.py
from celery import shared_task
from .utils import send_sms  # Utility function to send SMS
from .models import AlertMessage  # Import the AlertMessage model

@shared_task
def detect_anomaly(data):
    anomaly_detected = False
    message = ""

    # Rule-based anomaly detection
    if data['type'] == 'rainfall' and data['value'] > 50:
        anomaly_detected = True
        message = f"Heavy rainfall alert: {data['value']} mm/hr at {data['location']}"

    elif data['type'] == 'fire' and data['value'] == 1:
        anomaly_detected = True
        message = f"Fire detected at {data['location']}"

    elif data['type'] == 'earthquake' and data['value'] > 4.0:
        anomaly_detected = True
        message = f"Earthquake alert: Magnitude {data['value']} at {data['location']}"

    # Send SMS and save to database if anomaly is detected
    if anomaly_detected:
        send_sms(message, "+1234567890")  # Replace with user's phone number
        
        # Save the message to the database
        AlertMessage.objects.create(message=message)