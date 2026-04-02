import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface BookingWithDetails {
  id: string;
  bus_id: string;
  stop_id: string | null;
  seat_number: number;
  status: string;
  booked_at: string;
  bus?: {
    id: string;
    bus_number: string;
    capacity: number;
    booked_seats: number;
    route_id: string | null;
    driver_id: string | null;
    is_active: boolean;
    current_lat: number | null;
    current_lng: number | null;
  };
  route?: {
    id: string;
    name: string;
    start_time: string;
    drop_time: string;
    direction: string;
  };
}

export const useStudentBooking = () => {
  const { user } = useAuth();
  const [booking, setBooking] = useState<BookingWithDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    const fetchBooking = async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          bus:buses(id, bus_number, capacity, booked_seats, route_id, driver_id, is_active, current_lat, current_lng),
          stop:route_stops(id, name, pickup_time)
        `)
        .eq('student_id', user.id)
        .eq('status', 'active')
        .limit(1)
        .maybeSingle();

      if (data && !error) {
        // Fetch route info if bus has a route
        let route = null;
        const busData = data.bus as any;
        if (busData?.route_id) {
          const { data: routeData } = await supabase
            .from('routes')
            .select('*')
            .eq('id', busData.route_id)
            .maybeSingle();
          route = routeData;
        }
        setBooking({ ...data, bus: busData, route } as any);
      }
      setLoading(false);
    };

    fetchBooking();
  }, [user?.id]);

  return { booking, loading };
};
