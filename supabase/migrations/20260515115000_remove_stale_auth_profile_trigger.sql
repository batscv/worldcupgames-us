drop trigger if exists on_auth_user_created on auth.users;

revoke execute on function public.handle_new_user() from public, anon, authenticated;
