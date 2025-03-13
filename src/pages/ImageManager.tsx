
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { UploadedImagesGallery } from '@/components/UploadedImagesGallery';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';

export default function ImageManager() {
  const { user } = useAuth();

  // Redirect to home if not logged in
  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-8">Image Manager</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <UploadedImagesGallery />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
