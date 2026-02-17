import { supabase } from "@/integrations/supabase/client";

export async function uploadFile(file: File, userId: string) {
  const fileExt = file.name.split('.').pop();
  const filePath = `${userId}/${Date.now()}.${fileExt}`;
  
  const { error } = await supabase.storage
    .from('resources')
    .upload(filePath, file);

  if (error) throw error;

  const { data } = supabase.storage
    .from('resources')
    .getPublicUrl(filePath);

  return data.publicUrl;
}

export async function incrementDownloads(resourceId: string) {
  // Use rpc or direct update
  const { data: resource } = await supabase
    .from('resources')
    .select('downloads')
    .eq('id', resourceId)
    .single();
  
  if (resource) {
    await supabase
      .from('resources')
      .update({ downloads: resource.downloads + 1 })
      .eq('id', resourceId);
  }
}
