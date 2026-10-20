# Cloudinary Setup Guide

## 1. Create a Cloudinary Account
1. Go to [https://cloudinary.com](https://cloudinary.com)
2. Sign up for a free account
3. Verify your email address

## 2. Get Your Cloudinary Credentials
1. Go to your [Cloudinary Dashboard](https://cloudinary.com/console)
2. Copy the following values from your dashboard:
   - Cloud Name
   - API Key
   - API Secret

## 3. Set Environment Variables
Create a `.env` file in the `server` directory with the following variables:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

## 4. Features Included
- ✅ Image upload with progress tracking
- ✅ Multiple image upload support
- ✅ Automatic image optimization and resizing
- ✅ Secure uploads with authentication
- ✅ Image deletion functionality
- ✅ Fallback to manual URL input

## 5. Image Upload Endpoints
- `POST /api/upload/image` - Upload single image
- `POST /api/upload/images` - Upload multiple images
- `POST /api/upload/image-url` - Upload from URL/base64
- `DELETE /api/upload/image/:publicId` - Delete image

## 6. Usage in Components
The `ImageUploader` component automatically uses Cloudinary when configured:

```jsx
<ImageUploader
  images={form.images}
  onChange={(imgs) => setForm(f => ({ ...f, images: imgs }))}
/>
```

## 7. Image Storage
- Images are stored in the `airbnb-listings` folder
- Automatic optimization and format conversion
- Responsive image sizing (800x600 with auto crop)
- 5MB file size limit per image
