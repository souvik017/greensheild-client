import { useState, useCallback, useEffect } from 'react';

const REVERSE_GEO_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client';

const detectCity = async (latitude, longitude) => {
  try {
    const res = await fetch(
      `${REVERSE_GEO_URL}?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.city || data.locality || data.principalSubdivision || data.countryName || null;
  } catch {
    return null;
  }
};

export const useGeolocation = () => {
  const [state, setState] = useState({ status: 'loading', city: null, error: null });

  const detect = useCallback(() => {
    setState({ status: 'loading', city: null, error: null });

    if (!navigator.geolocation) {
      setState({ status: 'denied', city: null, error: 'unavailable' });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const city = await detectCity(latitude, longitude);
        setState((prev) => ({ ...prev, status: 'ready', city, error: null }));
      },
      () => {
        setState({ status: 'denied', city: null, error: 'permission' });
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );
  }, []);

  useEffect(() => {
    detect();
  }, [detect]);

  return { ...state, detect };
};