import { useEffect, useRef, useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useDriverLocation = (isSharing: boolean) => {
  const watchIdRef = useRef<number | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);

  const updateLocation = useCallback(async (lat: number, lng: number) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    setCurrentLocation({ lat, lng });

    const { error } = await supabase
      .from('driver_locations')
      .upsert(
        { driver_id: user.id, lat, lng, updated_at: new Date().toISOString() },
        { onConflict: 'driver_id' }
      );

    if (error) {
      console.error('Failed to update location:', error);
    }
  }, []);

  useEffect(() => {
    if (!isSharing) {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      return;
    }

    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        updateLocation(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        console.error('Geolocation error:', error);
        toast.error('Unable to get your location. Please enable location services.');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [isSharing, updateLocation]);

  return { currentLocation };
};
