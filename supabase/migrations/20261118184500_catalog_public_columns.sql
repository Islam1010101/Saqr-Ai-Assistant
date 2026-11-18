-- Approved catalogue metadata is visible, but admin audit columns stay server-only.
revoke select on public.efips_admin_catalog_books from anon, authenticated;
grant select (id, kind, status, language, title, author, isbn, cabinet, shelf_row, subject, book_url, audio_url, summary, created_at)
on public.efips_admin_catalog_books to anon, authenticated;
