import { useState, useEffect } from "react";
import { useGetCitiesQuery } from "@/features/home/home.api";

interface UserLocation {
  cityId: string | null;
  cityName: string | null;
  isLoading: boolean;
  isGeolocationDenied: boolean;
}

// Known city coordinates (approximate Swiss city centers)
const CITY_COORDINATES: Record<
  string,
  { lat: number; lon: number; name: string }
> = {
  zurich: { lat: 47.3769, lon: 8.5417, name: "Zürich" },
  bern: { lat: 46.948, lon: 7.4474, name: "Bern" },
  lausanne: { lat: 46.5197, lon: 6.6323, name: "Lausanne" },
  freiburg: { lat: 46.8065, lon: 7.1621, name: "Freiburg" },
  biel: { lat: 47.1372, lon: 7.2471, name: "Biel" },
  neuenburg: { lat: 46.992, lon: 6.931, name: "Neuenburg" },
};

function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function useUserLocation(): UserLocation {
  const [location, setLocation] = useState<UserLocation>({
    cityId: null,
    cityName: null,
    isLoading: true,
    isGeolocationDenied: false,
  });

  const { data: citiesData } = useGetCitiesQuery({
    limit: 100,
    is_active: true,
  });

  useEffect(() => {
    if (!citiesData?.data) return;

    if (!navigator.geolocation) {
      setLocation({
        cityId: null,
        cityName: null,
        isLoading: false,
        isGeolocationDenied: true,
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const cities = citiesData.data;

        // Find nearest city by matching slug to known coordinates
        let nearestCity = cities[0];
        let minDistance = Infinity;

        for (const city of cities) {
          // Try to match city by slug or name to known coordinates
          const slugKey = (city.slug?.split("-")[0] ?? "").toLowerCase();
          const nameKey = city.name.toLowerCase();
          const coords =
            CITY_COORDINATES[slugKey] || CITY_COORDINATES[nameKey];

          if (coords) {
            const distance = haversineDistance(
              latitude,
              longitude,
              coords.lat,
              coords.lon,
            );
            if (distance < minDistance) {
              minDistance = distance;
              nearestCity = city;
            }
          }
        }

        setLocation({
          cityId: nearestCity?.id ?? null,
          cityName: nearestCity?.name ?? null,
          isLoading: false,
          isGeolocationDenied: false,
        });
      },
      () => {
        // Geolocation denied or failed — no filtering
        setLocation({
          cityId: null,
          cityName: null,
          isLoading: false,
          isGeolocationDenied: true,
        });
      },
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 300000 },
    );
  }, [citiesData]);

  return location;
}
