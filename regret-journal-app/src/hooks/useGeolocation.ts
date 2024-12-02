import { useState, useEffect } from 'react';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  isLoading: boolean;
}

export const useGeolocation = (options?: PositionOptions): GeolocationState => {
  const [location, setLocation] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    isLoading: true
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation(prev => ({
        ...prev,
        error: 'Geolocation is not supported by this browser.',
        isLoading: false
      }));
      return;
    }

    const handleSuccess = (position: GeolocationPosition) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        error: null,
        isLoading: false
      });
    };

    const handleError = (error: GeolocationPositionError) => {
      let errorMessage = 'Unknown error';
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'User denied geolocation permission';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'Location information unavailable';
          break;
        case error.TIMEOUT:
          errorMessage = 'Location request timed out';
          break;
      }

      setLocation(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false
      }));
    };

    const watchId = navigator.geolocation.watchPosition(
      handleSuccess, 
      handleError, 
      { 
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
        ...options 
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return location;
};
