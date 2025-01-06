# serializers.py
from rest_framework_gis.serializers import GeoFeatureModelSerializer
from .models import SafeZone

class SafeZoneSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = SafeZone
        geo_field = "location"  # Specify the GeoDjango field
        fields = ('id', 'name', 'location')  # Include other fields if needed

    def to_representation(self, instance):
        # Transform the geometry field into a GeoJSON object
        representation = super().to_representation(instance)
        representation['geometry'] = {
            "type": "Point",
            "coordinates": [instance.location.x, instance.location.y]
        }
        return representation