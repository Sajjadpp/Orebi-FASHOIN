import axios from 'axios';  
import { toast } from 'react-hot-toast';

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dnmkzc4lh/image/upload';
const UPLOAD_PRESET = 'ml_default';

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  try {
    const response = await axios.post(CLOUDINARY_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('Upload successful:', response.data);
    return response.data;
  } catch (error) {
    toast.error(`Error while uploading image: ${error.message}`);
    console.error('Upload failed:', error);
    return null;
  }
};
