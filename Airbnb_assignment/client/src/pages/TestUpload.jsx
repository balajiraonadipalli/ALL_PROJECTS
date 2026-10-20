import { useState } from 'react';
import api from '../lib/api.js';

export default function TestUpload() {
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const testCloudinaryConnection = async () => {
    try {
      const response = await api.get('/upload/test');
      setResult(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data || err.message);
      setResult(null);
    }
  };

  const testImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await api.post('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResult(response.data);
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Cloudinary Upload Test</h1>
      
      <div className="space-y-6">
        {/* Test Connection */}
        <div className="border p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Test Cloudinary Connection</h2>
          <button
            onClick={testCloudinaryConnection}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Test Connection
          </button>
          {result && (
            <div className="mt-2 p-2 bg-green-100 text-green-800 rounded">
              <pre>{JSON.stringify(result, null, 2)}</pre>
            </div>
          )}
          {error && (
            <div className="mt-2 p-2 bg-red-100 text-red-800 rounded">
              <pre>{JSON.stringify(error, null, 2)}</pre>
            </div>
          )}
        </div>

        {/* Test Upload */}
        <div className="border p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Test Image Upload</h2>
          <input
            type="file"
            accept="image/*"
            onChange={testImageUpload}
            disabled={uploading}
            className="mb-2"
          />
          {uploading && <p className="text-blue-600">Uploading...</p>}
          {result && (
            <div className="mt-2 p-2 bg-green-100 text-green-800 rounded">
              <pre>{JSON.stringify(result, null, 2)}</pre>
              {result.imageUrl && (
                <div className="mt-2">
                  <p className="text-sm font-medium">Image URL: {result.imageUrl}</p>
                  <img 
                    src={result.imageUrl} 
                    alt="Uploaded" 
                    className="max-w-xs rounded border"
                    onLoad={() => console.log('Image loaded successfully')}
                    onError={(e) => console.error('Image failed to load:', e)}
                  />
                </div>
              )}
            </div>
          )}
          {error && (
            <div className="mt-2 p-2 bg-red-100 text-red-800 rounded">
              <pre>{JSON.stringify(error, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
