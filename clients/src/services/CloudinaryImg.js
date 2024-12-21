import axios from "axios";

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload';
const CLOUDINARY_UPLOAD_PRESET = 'YOUR_UPLOAD_PRESET';

export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('folder', 'products');
  
  try {
    const response = await axios.post(CLOUDINARY_URL, formData);
    return response.data.secure_url;
  } catch (error) {
    throw new Error('Failed to upload image to Cloudinary');
  }
};