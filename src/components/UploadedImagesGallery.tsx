
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { ImageUpload } from './ImageUpload';

export function UploadedImagesGallery() {
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const bucket = 'site-images';

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setIsLoading(true);
      
      // List all files in the bucket
      const { data, error } = await supabase.storage
        .from(bucket)
        .list();

      if (error) {
        throw error;
      }

      if (data) {
        // Get public URLs for all images
        const imageUrls = await Promise.all(
          data.map(async (file) => {
            const { data: publicURL } = supabase.storage
              .from(bucket)
              .getPublicUrl(file.name);
            return publicURL.publicUrl;
          })
        );
        
        setImages(imageUrls);
      }
    } catch (error: any) {
      console.error('Error fetching images:', error.message);
      toast({
        title: "Failed to load images",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUploaded = (url: string) => {
    setImages((prev) => [...prev, url]);
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "URL copied",
      description: "Image URL copied to clipboard",
    });
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Upload New Image</h2>
        <ImageUpload 
          onImageUploaded={handleImageUploaded} 
          bucket={bucket}
        />
      </div>
      
      <div>
        <h2 className="text-2xl font-bold mb-4">Your Uploaded Images</h2>
        {isLoading ? (
          <p>Loading images...</p>
        ) : images.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((url, index) => (
              <div key={index} className="relative group">
                <img 
                  src={url} 
                  alt={`Uploaded image ${index}`} 
                  className="w-full h-40 object-cover rounded-md shadow-sm"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-md">
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => copyToClipboard(url)}
                  >
                    Copy URL
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No images uploaded yet.</p>
        )}
      </div>
    </div>
  );
}
