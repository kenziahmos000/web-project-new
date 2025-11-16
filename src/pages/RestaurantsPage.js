import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/RestaurantsPage.css";

// Fix default marker icon issue with Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// red marker on map
const userIcon = new L.Icon({
  iconUrl:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='25' height='41' viewBox='0 0 25 41'%3E%3Cpath fill='%23ff6f61' d='M12.5 0C5.6 0 0 5.6 0 12.5c0 1.8.4 3.5 1.1 5.1L12.5 41l11.4-23.4c.7-1.6 1.1-3.3 1.1-5.1C25 5.6 19.4 0 12.5 0zm0 17.5c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5z'/%3E%3C/svg%3E",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Component to recenter map when location changes
function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
}

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchRadius, setSearchRadius] = useState(1000); // meters

  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
    if (userLocation) {
      fetchNearbyRestaurants(userLocation[0], userLocation[1], searchRadius);
    }
  }, [userLocation, searchRadius]);

  const getUserLocation = () => {
    setLoading(true);
    setError("");

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      // Default random
      setUserLocation([37.7749, -122.4194]);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log("hereee");
        console.log("Position:", position);
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        setLoading(false);
      },
      (err) => {
        console.error("Error getting location:", err);
        setError("Unable to get your location. Showing default location.");
        // Default random
        setUserLocation([37.7749, -122.4194]);
        setLoading(false);
      }
    );
  };

  const fetchNearbyRestaurants = async (lat, lon, radius) => {
    try {
      setLoading(true);

      // Overpass API query for restaurants
      const query = `
        [out:json][timeout:25];
        (
          node["amenity"="restaurant"](around:${radius},${lat},${lon});
          way["amenity"="restaurant"](around:${radius},${lat},${lon});
          node["amenity"="cafe"](around:${radius},${lat},${lon});
          way["amenity"="cafe"](around:${radius},${lat},${lon});
        );
        out body;
        >;
        out skel qt;
      `;

      const response = await fetch(
        `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(
          query
        )}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch restaurants");
      }

      const data = await response.json();

      // Process results
      const processedRestaurants = data.elements
        .filter((element) => element.lat && element.lon && element.tags)
        .map((element) => ({
          id: element.id,
          lat: element.lat,
          lon: element.lon,
          name: element.tags.name || "Unknown Name",
          cuisine: element.tags.cuisine || "Not specified",
          type: element.tags.amenity || "restaurant",
          phone: element.tags.phone || element.tags["contact:phone"] || "N/A",
          website:
            element.tags.website || element.tags["contact:website"] || "",
          address: element.tags["addr:street"]
            ? `${element.tags["addr:housenumber"] || ""} ${
                element.tags["addr:street"]
              }`
            : "Address not available",
        }));

      setRestaurants(processedRestaurants);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching restaurants:", err);
      setError("Failed to load nearby restaurants");
      setLoading(false);
    }
  };

  const handleRadiusChange = (e) => {
    setSearchRadius(parseInt(e.target.value));
  };

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance; // in kilometers
  };

  // Get top 10 closest restaurants
  const top10Restaurants = userLocation
    ? restaurants
        .map((restaurant) => ({
          ...restaurant,
          distance: calculateDistance(
            userLocation[0],
            userLocation[1],
            restaurant.lat,
            restaurant.lon
          ),
        }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 10)
    : [];

  return (
    <div className="restaurants-page">
      <div className="restaurants-container">
        {/* Controls Panel */}
        <div className="controls-panel">
          <div className="controls-header">
            <h2>🍽️ Nearby Restaurants</h2>
            <p>
              Found <strong>{restaurants.length}</strong> places near you
            </p>
          </div>

          {/* Radius Control */}
          <div className="search-controls">
            <label htmlFor="radius">Search Radius:</label>
            <select
              id="radius"
              value={searchRadius}
              onChange={handleRadiusChange}
              className="radius-select"
            >
              <option value="500">500m (~5 min walk)</option>
              <option value="1000">1 km (~12 min walk)</option>
              <option value="2000">2 km (~25 min walk)</option>
              <option value="3000">3 km (~35 min walk)</option>
              <option value="5000">5 km (~1 hour walk)</option>
              <option value="10000">10 km (~2 hour walk)</option>
              <option value="15000">15 km (~3 hour walk)</option>
              <option value="20000">20 km (driving distance)</option>
            </select>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button onClick={getUserLocation} className="btn-refresh">
            📍 Refresh My Location
          </button>

          {/* Top 10 Closest Restaurants List */}
          {top10Restaurants.length > 0 && (
            <div className="top-10-list">
              <h3>📍 10 Closest Places</h3>
              <div className="restaurant-list">
                {top10Restaurants.map((restaurant, index) => (
                  <div key={restaurant.id} className="restaurant-item">
                    <div className="restaurant-rank">{index + 1}</div>
                    <div className="restaurant-info">
                      <div className="restaurant-name">{restaurant.name}</div>
                      <div className="restaurant-details">
                        {restaurant.type === "cafe" ? "☕" : "🍽️"}{" "}
                        {restaurant.cuisine !== "Not specified"
                          ? restaurant.cuisine
                          : restaurant.type}
                      </div>
                      <div className="restaurant-distance">
                        📏{" "}
                        {restaurant.distance < 1
                          ? `${Math.round(restaurant.distance * 1000)}m`
                          : `${restaurant.distance.toFixed(2)}km`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Map Container */}
        <div className="map-wrapper">
          {loading && !userLocation && (
            <div className="loading-overlay">
              <div className="spinner"></div>
              <p>Getting your location...</p>
            </div>
          )}

          {userLocation && (
            <MapContainer
              center={userLocation}
              zoom={14}
              style={{ height: "100%", width: "100%" }}
              className="leaflet-map"
            >
              <ChangeView center={userLocation} zoom={14} />

              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />

              {/* User Location Marker */}
              <Marker position={userLocation} icon={userIcon}>
                <Popup>
                  <div className="popup-content">
                    <strong>📍 You are here</strong>
                  </div>
                </Popup>
              </Marker>

              {/* Restaurant Markers */}
              {restaurants.map((restaurant) => (
                <Marker
                  key={restaurant.id}
                  position={[restaurant.lat, restaurant.lon]}
                >
                  <Popup>
                    <div className="popup-content">
                      <h3>{restaurant.name}</h3>
                      <p>
                        <strong>Type:</strong>{" "}
                        {restaurant.type === "cafe"
                          ? "☕ Café"
                          : "🍽️ Restaurant"}
                      </p>
                      {restaurant.cuisine !== "Not specified" && (
                        <p>
                          <strong>Cuisine:</strong> {restaurant.cuisine}
                        </p>
                      )}
                      {restaurant.address !== "Address not available" && (
                        <p>
                          <strong>Address:</strong> {restaurant.address}
                        </p>
                      )}
                      {restaurant.phone !== "N/A" && (
                        <p>
                          <strong>Phone:</strong> {restaurant.phone}
                        </p>
                      )}
                      {restaurant.website && (
                        <p>
                          <a
                            href={restaurant.website}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Visit Website
                          </a>
                        </p>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}
        </div>
      </div>
    </div>
  );
}
