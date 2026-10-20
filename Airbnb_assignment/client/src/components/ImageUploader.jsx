import { useState } from 'react';
import api from '../lib/api.js';

export default function ImageUploader({ images, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });

  const uploadViaGridFS = async (file) => {
    const dataUrl = await fileToBase64(file);
    const res = await api.post('/files/base64', { data: dataUrl, filename: file.name, contentType: file.type || 'image/png' });
    const fileId = res.data?.fileId;
    if (!fileId) throw new Error('No fileId returned');
    // Return API URL usable in <img src>
    return `/api/files/${fileId}`;
  };

  const handleFiles = async (files) => {
    if (!files || files.length === 0) return;
    
    console.log('Starting upload for files:', files.length);
    setUploading(true);
    setUploadProgress(0);
    
    try {
      // Upload files one by one to avoid issues
      const uploadedUrls = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        console.log(`Uploading file ${i + 1}/${files.length}:`, file.name, file.size, file.type);
        
        const formData = new FormData();
        formData.append('image', file);

        let imageUrl;
        try {
          const response = await api.post('/upload/image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setUploadProgress(percentCompleted);
            }
          },
          });
          console.log(`File ${i + 1} upload response:`, response.data);
          if (response.data.success && response.data.imageUrl) {
            imageUrl = response.data.imageUrl;
          }
        } catch (_e) {
          // Fallback to GridFS
          imageUrl = await uploadViaGridFS(file);
        }
        if (imageUrl) uploadedUrls.push(imageUrl);
      }

      if (uploadedUrls.length > 0) {
        console.log('All files uploaded successfully:', uploadedUrls);
        onChange([...(images || []), ...uploadedUrls]);
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      console.error('Error response:', error.response?.data);
      
      if (error.response?.status === 401) {
        alert('Please log in to upload images');
        // Redirect to login or handle authentication
      } else if (error.response?.status === 400) {
        alert(`Upload failed: ${error.response?.data?.error || 'Invalid file format'}`);
      } else {
        alert(`Failed to upload images: ${error.response?.data?.error || error.message}`);
      }
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleSingleFile = async (file) => {
    if (!file) return;
    
    console.log('Starting single file upload:', file.name, file.size, file.type);
    setUploading(true);
    setUploadProgress(0);
    
    try {
      const formData = new FormData();
      formData.append('image', file);

      console.log('Sending single upload request...');
      let imageUrl;
      try {
        const response = await api.post('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          }
        },
        });
        console.log('Single upload response:', response.data);
        if (response.data.success && response.data.imageUrl) {
          imageUrl = response.data.imageUrl;
        }
      } catch (_e) {
        imageUrl = await uploadViaGridFS(file);
      }
      if (imageUrl) onChange([...(images || []), imageUrl]);
    } catch (error) {
      console.error('Error uploading single image:', error);
      console.error('Error response:', error.response?.data);
      
      if (error.response?.status === 401) {
        alert('Please log in to upload images');
      } else if (error.response?.status === 400) {
        alert(`Upload failed: ${error.response?.data?.error || 'Invalid file format'}`);
      } else {
        alert(`Failed to upload image: ${error.response?.data?.error || error.message}`);
      }
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Section */}
      <div>
        <label className="block text-sm font-medium mb-2">Upload Images</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFiles(Array.from(e.target.files || []))}
            className="hidden"
            id="image-upload"
            disabled={uploading}
          />
          <label 
            htmlFor="image-upload" 
            className="cursor-pointer flex flex-col items-center gap-2"
          >
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span className="text-sm text-gray-600">
              {uploading ? 'Uploading...' : 'Click to upload images'}
            </span>
            <span className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB each</span>
          </label>
          
          {uploading && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-600 mt-1">{uploadProgress}% uploaded</p>
            </div>
          )}
        </div>
      </div>

      {/* Manual URL Input */}
      <div>
        <label className="block text-sm font-medium mb-2">Or add image URLs</label>
        <div className="space-y-2">
          <input
            type="url"
            placeholder="https://example.com/photo.jpg"
            className="w-full px-3 py-2 border rounded smooth-transition focus:ring-2 focus:ring-red-500 focus:border-red-500"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                const url = e.currentTarget.value.trim();
                if (url) {
                  onChange([...(images || []), url]);
                  e.currentTarget.value = '';
                }
              }
            }}
          />
        </div>
      </div>

      {/* Image Preview Grid */}
      {(images || []).length > 0 && (
        <div>
          <label className="block text-sm font-medium mb-2">Uploaded Images ({images.length})</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {images.map((src, i) => (
              <div key={`${src}-${i}`} className="relative group">
                <img 
                  src={src} 
                  alt={`Upload ${i + 1}`} 
                  className="w-full h-24 object-cover rounded-lg border" 
                />
                <button
                  type="button"
                  onClick={() => onChange(images.filter((_, idx) => idx !== i))}
                  className="absolute top-1 right-1 text-xs bg-red-500 text-white px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 smooth-transition hover:bg-red-600"
                >
                  ✕
                </button>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg smooth-transition"></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


