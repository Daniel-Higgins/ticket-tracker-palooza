
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type ImageUploadProps = {
  onImageUploaded?: (url: string) => void;
  bucket?: string;
  className?: string;
};

export function ImageUpload({ onImageUploaded, bucket = 'site-images', className }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${fileName}`;

      // Check if bucket exists
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(b => b.name === bucket);
      
      if (!bucketExists) {
        toast({
          title: "Storage bucket not found",
          description: "Please create the storage bucket in Supabase first.",
          variant: "destructive"
        });
        return;
      }

      // Upload the file
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: publicURL } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      if (publicURL && onImageUploaded) {
        onImageUploaded(publicURL.publicUrl);
        toast({
          title: "Image uploaded",
          description: "Your image has been uploaded successfully.",
        });
      }
    } catch (error: any) {
      console.error('Error uploading image:', error.message);
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      // Reset the input
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  return (
    <div className={className}>
      <div className="flex items-center gap-2">
        <Input
          type="file"
          accept="image/*"
          onChange={uploadImage}
          disabled={isUploading}
          className="max-w-xs"
        />
        {isUploading && <p className="text-sm text-muted-foreground">Uploading...</p>}
      </div>
    </div>
  );
}
