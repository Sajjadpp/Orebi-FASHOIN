export const validateForm = (formData, setErrors) => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.place.trim()) newErrors.place = 'Place is required';
    if (!formData.pincode) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Pincode must be 6 digits';
    }
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData?.country?.trim()) newErrors.country = 'Country is required';
    if (!formData.fullAddress.trim()) newErrors.fullAddress = 'Full address is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };