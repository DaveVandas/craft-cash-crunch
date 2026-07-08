
-- 1) Revoke EXECUTE on internal / trigger-only SECURITY DEFINER functions
--    from client-facing roles (anon, authenticated). Trigger execution and
--    edge-function (service_role) calls are unaffected.

REVOKE EXECUTE ON FUNCTION public.handle_new_user()                        FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user_profile()                FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_affiliate_signup()                FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_affiliate_conversion()            FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.notify_affiliate_on_approval()           FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.notify_affiliate_on_commission_change()  FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.notify_affiliate_w9_threshold()          FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.send_welcome_notification()              FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.validate_achievement()                   FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column()               FROM PUBLIC, anon, authenticated;

REVOKE EXECUTE ON FUNCTION public.cleanup_rate_limits(integer)             FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.cleanup_expired_guest_sessions()         FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.check_rate_limit(text, integer, integer) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.increment_affiliate_referrals(uuid)      FROM PUBLIC, anon, authenticated;

-- 2) Drop broad SELECT (list) policies on public storage buckets.
--    Public buckets serve files via /object/public/... which bypasses RLS,
--    so direct downloads keep working; only bucket listing is removed.

DROP POLICY IF EXISTS "Avatar images are publicly accessible"    ON storage.objects;
DROP POLICY IF EXISTS "Celebrity images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "OG images are publicly accessible"        ON storage.objects;
