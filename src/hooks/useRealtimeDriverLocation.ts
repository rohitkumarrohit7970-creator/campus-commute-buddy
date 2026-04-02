import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface DriverLocation {
  driver_id: string;
  lat: number;
  lng: number;
  updated_at: string;
}

export const useRealtimeDriverLocation = (driverIds: string[]) => {
  const [locations, setLocations] = useState<Record<string, DriverLocation>>({});

  useEffect(() => {
    if (!driverIds.length) return;

    // Initial fetch
    const fetchLocations = async () => {
      const { data, error } = await supabase
        .from('driver_locations')
        .select('*')
        .in('driver_id', driverIds);

      if (data && !error) {
        const map: Record<string, DriverLocation> = {};
        data.forEach((loc: any) => {
          map[loc.driver_id] = loc;
        });
        setLocations(map);
      }
    };

    fetchLocations();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('driver-locations-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'driver_locations',
        },
        (payload) => {
          const newLoc = payload.new as DriverLocation;
          if (newLoc && driverIds.includes(newLoc.driver_id)) {
            setLocations(prev => ({
              ...prev,
              [newLoc.driver_id]: newLoc,
            }));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [driverIds.join(',')]);

  return locations;
};
