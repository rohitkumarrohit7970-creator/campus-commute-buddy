
-- Drop the overly permissive policy
DROP POLICY "Authenticated users can create notifications" ON public.notifications;

-- Create a more restrictive policy - only allow creating notifications for drivers
CREATE POLICY "Authenticated can notify drivers"
  ON public.notifications FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = recipient_id AND role = 'driver'
    )
  );
