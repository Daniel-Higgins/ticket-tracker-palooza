
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { UploadedImagesGallery } from '@/components/UploadedImagesGallery';

export default function UploadImages() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container max-w-7xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-6">Upload Images</h1>
        <p className="text-muted-foreground mb-8">
          Upload your own images to use throughout the site. After uploading, you can copy the image URL and use it in your content.
        </p>
        
        <UploadedImagesGallery />
      </main>
      
      <Footer />
    </div>
  );
}
