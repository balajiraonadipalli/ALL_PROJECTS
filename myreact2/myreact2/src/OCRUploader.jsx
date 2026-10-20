import React, { useState } from 'react';
import axios from 'axios';

const OCRUploader = () => {
    const [imageUrl, setImageUrl] = useState('');
    const [extractedText, setExtractedText] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) {
            alert('Please select an image!');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'balajirao'); // Replace with your Cloudinary preset

        try {
            setLoading(true);
            // ✅ Upload to Cloudinary
            const cloudinaryResponse = await axios.post(
                'https://api.cloudinary.com/v1_1/df0hm55mm/image/upload', // Replace with your Cloudinary cloud name
                formData
            );

            console.log('Uploaded Image:', cloudinaryResponse.data);
            setImageUrl(cloudinaryResponse.data.secure_url);

            // ✅ Detect text using Google Cloud Vision API
            const visionApiUrl = `https://vision.googleapis.com/v1/images:annotate?key=YOUR_GOOGLE_CLOUD_VISION_API_KEY`; // Replace with your API key
            const requestBody = {
                requests: [
                    {
                        image: {
                            source: {
                                imageUri: cloudinaryResponse.data.secure_url,
                            },
                        },
                        features: [{ type: 'TEXT_DETECTION' }],
                    },
                ],
            };

            const visionResponse = await axios.post(visionApiUrl, requestBody);
            const detections = visionResponse.data.responses[0].textAnnotations;
            const text = detections ? detections[0].description : 'No text found';

            console.log('Extracted Text:', text);
            setExtractedText(text);

            alert('Image uploaded and processed successfully!');
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to upload or process the image.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-blue-500 p-6 rounded-lg shadow-md w-96">
                <input
                    type="file"
                    onChange={handleFileChange}
                    className="mb-4 w-full p-2 border rounded-lg"
                />
                {loading && <p className="text-white">Processing...</p>}
                {imageUrl && (
                    <img
                        src={imageUrl}
                        alt="Uploaded"
                        className="rounded-lg mb-4 w-full"
                    />
                )}
                <textarea
                    value={extractedText}
                    readOnly
                    placeholder="Extracted text will appear here..."
                    className="w-full h-40 p-2 border rounded-lg"
                />
            </div>
        </div>
    );
};

export default OCRUploader;
