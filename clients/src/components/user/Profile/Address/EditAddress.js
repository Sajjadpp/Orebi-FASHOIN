import React, { useEffect, useState } from 'react';
import { validateForm } from '../../payment/AddressSection/vlidation';
import InputField from "../../checkOutPage/Address/AddressInput"
import { userAxiosInstance } from '../../../../redux/constants/AxiosInstance';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
const EditAddress = ({ isOpen, onClose, initialAddress, refreshData}) => {

  const [formData, setFormData] = useState({
    addressType: initialAddress.addressType,
    name: initialAddress.name,
    place: initialAddress.place,
    pincode: initialAddress.pincode,
    state: initialAddress.state,
    country: initialAddress.country,
    fullAddress: initialAddress.fullAddress
  });

  useEffect(()=>{
    setFormData(initialAddress)

  },[initialAddress])

  const [errors, setErrors] = useState({});
  const [activeField, setActiveField] = useState('');

    const userId = useSelector(state => state.userReducer.user._id)

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (validateForm(formData, setErrors)) {
        let notChanged = JSON.stringify(initialAddress) === JSON.stringify(formData)
        if(notChanged){
            toast.success('address changed');
            return onClose();
        }
        try{
            let response = await userAxiosInstance.patch('/address',{...formData, userId})
            toast.success(response.data)
            refreshData()
            return onClose();
        }
        catch(error){
            toast.error(error.response.data)
        }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] flex flex-col m-4">
        {/* Fixed Header */}
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Add New Address</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-gray-700">Address Type</label>
              <div className="flex space-x-4">
                {['HOME', 'WRKSPACE'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, addressType: type }))}
                    className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all duration-200 ${
                      formData.addressType === type 
                        ? 'border-gray-500 bg-gray-50 text-gray-600' 
                        : 'border-black-200 hover:border-black-300'
                    }`}
                  >
                    {type === 'HOME' ? '🏠 Home' : '💼 Workspace'}
                  </button>
                ))}
              </div>
            </div>

            {/* Form fields remain the same */}
            <InputField
                setActiveField={setActiveField}
                errors ={errors}
                activeField={activeField}
                formData={formData}
                handleChange={handleChange}
                label="Full Name"
                name="name"
                placeholder="Enter your full name"
            />

            <InputField
                setActiveField={setActiveField}
                errors ={errors}
                activeField={activeField}
                formData={formData}
                handleChange={handleChange}
                label="Place"
                name="place"
                placeholder="Enter your place"
            />

            <div className="grid grid-cols-2 gap-4">
              <InputField
                setActiveField={setActiveField}
                errors ={errors}
                activeField={activeField}
                formData={formData}
                handleChange={handleChange}
                label="Pincode"
                name="pincode"
                placeholder="6-digit pincode"
                maxLength={6}
                type="number"
              />

              <InputField
                setActiveField={setActiveField}
                errors ={errors}
                activeField={activeField}
                formData={formData}
                handleChange={handleChange}
                label="State"
                name="state"
                placeholder="Enter state"
              />
            </div>

            <InputField
                setActiveField={setActiveField}
                errors ={errors}
                activeField={activeField}
                formData={formData}
                handleChange={handleChange}
                label="Country"
                name="country"
                placeholder="Enter country"
            />

            <InputField
              setActiveField={setActiveField}
              errors ={errors}
              activeField={activeField}
              formData={formData}
              handleChange={handleChange}
              label="Full Address"
              name="fullAddress"
              placeholder="Enter your complete address"
              isTextarea={true}
            />
          </form>
        </div>

        {/* Fixed Footer */}
        <div className="p-6 border-t bg-white">
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={()=> onClose(false)}
              className="px-6 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              type="button"
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Save Address
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditAddress;