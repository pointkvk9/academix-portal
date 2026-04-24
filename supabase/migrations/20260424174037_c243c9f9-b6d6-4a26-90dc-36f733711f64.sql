create policy "Users can update own documents"
on storage.objects
for update
to public
using (
  bucket_id = 'documents'
  and auth.uid()::text = (storage.foldername(name))[1]
)
with check (
  bucket_id = 'documents'
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Admins can manage all documents"
on storage.objects
for all
to public
using (
  bucket_id = 'documents'
  and public.has_role(auth.uid(), 'admin')
)
with check (
  bucket_id = 'documents'
  and public.has_role(auth.uid(), 'admin')
);