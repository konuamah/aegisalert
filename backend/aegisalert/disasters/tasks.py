from celery import shared_task
from django.core.mail import send_mail
from django.contrib.auth import get_user_model
from django.contrib.gis.measure import D
from django.db.models import Q
from .models import Disaster
from safezone.models import SafeZone

@shared_task
def notify_users_about_disaster(disaster_id):
    try:
        # Fetch the disaster
        disaster = Disaster.objects.get(id=disaster_id)
        if disaster.active:
            # Get all active disasters
            active_disasters = Disaster.objects.filter(active=True)

            # Build a query to exclude safe zones within the affected radius of any active disaster
            exclusion_query = Q()
            for active_disaster in active_disasters:
                exclusion_query |= Q(location__distance_lte=(active_disaster.location, D(km=active_disaster.affected_radius)))

            # Fetch safe zones outside the affected radius of all active disasters
            safe_zones = SafeZone.objects.exclude(exclusion_query)

            # Fetch all users
            User = get_user_model()
            users = User.objects.all()

            # Prepare the email content
            for user in users:
                subject = f"New Disaster Alert: {disaster.name}"

                # Include the list of available safe zones in the email
                if safe_zones.exists():
                    safe_zone_list = "\n".join([f"- {sz.name} (Location: {sz.location})" for sz in safe_zones])
                    message = f"""
Hello {user.username},

A new disaster has been reported:

- Name: {disaster.name}
- Location: {disaster.location}
- Affected Radius: {disaster.affected_radius} km

Available Safe Zones (outside the affected area):
{safe_zone_list}

Please proceed to one of the safe zones listed above.

Best regards,
The AegisAlert Team
"""
                else:
                    message = f"""
Hello {user.username},

A new disaster has been reported:

- Name: {disaster.name}
- Location: {disaster.location}
- Affected Radius: {disaster.affected_radius} km

No safe zones are currently available outside the affected area. Please follow local authorities' instructions.

Best regards,
The AegisAlert Team
"""

                # Send the email
                send_mail(
                    subject,
                    message,
                    'noreply@example.com',  # Replace with your email
                    [user.email],
                    fail_silently=False,
                )

            print(f"Disaster notifications sent for {disaster.name}")
        else:
            print(f"Disaster {disaster.name} is not active. No notifications sent.")
    except Disaster.DoesNotExist:
        print(f"Disaster with ID {disaster_id} does not exist.")
    except Exception as e:
        print(f"Error sending disaster notifications: {e}")