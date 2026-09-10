-- handle_new_user sadece auth.users trigger'ı tarafından çağrılmalı, REST API üzerinden değil.
revoke execute on function public.handle_new_user() from public, anon, authenticated;

-- create_family / join_family sadece oturum açmış kullanıcılar için anlamlı.
revoke execute on function public.create_family(text) from anon;
revoke execute on function public.join_family(text) from anon;

-- is_family_member yalnızca uygulama içinden (RLS policy'leri ve authenticated kullanıcılar) kullanılmalı.
revoke execute on function public.is_family_member(uuid) from anon;
