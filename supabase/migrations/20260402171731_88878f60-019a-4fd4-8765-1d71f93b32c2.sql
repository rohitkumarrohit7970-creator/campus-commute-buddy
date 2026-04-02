
-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'student', 'driver');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  college_id TEXT,
  profile_image TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create routes table
CREATE TABLE public.routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  start_time TEXT NOT NULL,
  drop_time TEXT NOT NULL,
  direction TEXT NOT NULL DEFAULT 'morning_to_college',
  college_lat DOUBLE PRECISION NOT NULL DEFAULT 30.2672,
  college_lng DOUBLE PRECISION NOT NULL DEFAULT 78.0081,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.routes ENABLE ROW LEVEL SECURITY;

-- Create route_stops table
CREATE TABLE public.route_stops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id UUID REFERENCES public.routes(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  pickup_time TEXT NOT NULL,
  stop_order INT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.route_stops ENABLE ROW LEVEL SECURITY;

-- Create buses table
CREATE TABLE public.buses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bus_number TEXT NOT NULL UNIQUE,
  capacity INT NOT NULL DEFAULT 50,
  booked_seats INT NOT NULL DEFAULT 0,
  route_id UUID REFERENCES public.routes(id) ON DELETE SET NULL,
  driver_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  current_lat DOUBLE PRECISION,
  current_lng DOUBLE PRECISION,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.buses ENABLE ROW LEVEL SECURITY;

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  bus_id UUID REFERENCES public.buses(id) ON DELETE CASCADE NOT NULL,
  stop_id UUID REFERENCES public.route_stops(id) ON DELETE SET NULL,
  seat_number INT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  booked_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Create driver_locations table (real-time GPS)
CREATE TABLE public.driver_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.driver_locations ENABLE ROW LEVEL SECURITY;

-- Enable realtime for driver_locations
ALTER PUBLICATION supabase_realtime ADD TABLE public.driver_locations;

-- Helper function: check if user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Helper: check if student has booking on a bus
CREATE OR REPLACE FUNCTION public.has_booking_for_bus(_user_id UUID, _bus_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.bookings
    WHERE student_id = _user_id AND bus_id = _bus_id AND status = 'active'
  )
$$;

-- Helper: get bus_id for a driver
CREATE OR REPLACE FUNCTION public.get_driver_bus_id(_driver_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.buses WHERE driver_id = _driver_id LIMIT 1
$$;

-- Helper: check if student has booking on a driver's bus
CREATE OR REPLACE FUNCTION public.student_has_booking_for_driver(_student_id UUID, _driver_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.bookings b
    JOIN public.buses bus ON b.bus_id = bus.id
    WHERE b.student_id = _student_id
      AND bus.driver_id = _driver_id
      AND b.status = 'active'
  )
$$;

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_routes_updated_at BEFORE UPDATE ON public.routes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_buses_updated_at BEFORE UPDATE ON public.buses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_driver_locations_updated_at BEFORE UPDATE ON public.driver_locations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ RLS POLICIES ============

-- user_roles policies
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage profiles" ON public.profiles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- routes policies (public read)
CREATE POLICY "Anyone authenticated can view routes" ON public.routes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage routes" ON public.routes FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- route_stops policies (public read)
CREATE POLICY "Anyone authenticated can view stops" ON public.route_stops FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage stops" ON public.route_stops FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- buses policies (public read)
CREATE POLICY "Anyone authenticated can view buses" ON public.buses FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage buses" ON public.buses FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Drivers can update own bus" ON public.buses FOR UPDATE USING (auth.uid() = driver_id);

-- bookings policies
CREATE POLICY "Students can view own bookings" ON public.bookings FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Admins can view all bookings" ON public.bookings FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Drivers can view bookings for their bus" ON public.bookings FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.buses WHERE buses.id = bookings.bus_id AND buses.driver_id = auth.uid())
);
CREATE POLICY "Students can create bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Students can cancel own bookings" ON public.bookings FOR UPDATE USING (auth.uid() = student_id);
CREATE POLICY "Admins can manage bookings" ON public.bookings FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- driver_locations policies
CREATE POLICY "Drivers can upsert own location" ON public.driver_locations FOR INSERT WITH CHECK (auth.uid() = driver_id);
CREATE POLICY "Drivers can update own location" ON public.driver_locations FOR UPDATE USING (auth.uid() = driver_id);
CREATE POLICY "Admins can view all locations" ON public.driver_locations FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Students can view location for booked bus driver" ON public.driver_locations FOR SELECT USING (
  public.student_has_booking_for_driver(auth.uid(), driver_id)
);
CREATE POLICY "Drivers can view own location" ON public.driver_locations FOR SELECT USING (auth.uid() = driver_id);
