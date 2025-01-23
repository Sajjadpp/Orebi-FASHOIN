import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { adminAxiosInstance } from '../../../redux/constants/AxiosInstance';
import toast from 'react-hot-toast';
import { useLocation, useParams } from 'react-router-dom';

const EditCouponPage = () => {

    const [formData, setFormData] = useState([]);
    const [errors, setErrors] = useState({});


    let location = useLocation();
    let params = useParams()

    
    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.code) {
            newErrors.code = 'Coupon code is required';
        }
        
        if (!formData.discountValue || formData.discountValue <= 0) {
            newErrors.discountValue = 'Please enter a valid discount value';
        }
        
        if (formData.discountType === 'percentage' && formData.discountValue > 100) {
            newErrors.discountValue = 'Percentage cannot be greater than 100';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('working e.prevernt default')
        if (validateForm()) {
            try {
                await adminAxiosInstance.put(`/coupon/${params.id}`, formData);
                toast.success('Coupon added successfully');
                window.history.back();
            } catch (error) {
                toast.error('Failed to add coupon. Please try again later');
                console.error('Error submitting form:', error);
            }
        }
    };

    useEffect(() =>{
        let {startDate,endDate, ...data} = {...location.state}
        console.log(data,"data")
        setFormData({...data})
    },[])

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <button 
                                onClick={() => window.history.back()} 
                                className="flex items-center text-gray-600 hover:text-gray-900"
                            >
                                <ArrowLeft className="w-5 h-5 mr-2" />
                                Back to Coupons
                            </button>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Add New Coupon</h1>
                        <div className="w-24"></div> {/* Spacer for center alignment */}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow px-6 py-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Coupon Code*
                            </label>
                            <input
                                type="text"
                                name="code"
                                value={formData.code}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none
                                    ${errors.code ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="e.g., SUMMER2025"
                            />
                            {errors.code && (
                                <p className="mt-1 text-sm text-red-500">{errors.code}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Discount Type*
                                </label>
                                <select
                                    name="discountType"
                                    value={formData.discountType}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="percentage">Percentage</option>
                                    <option value="fixed">Fixed Amount</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Discount Value*
                                </label>
                                <input
                                    type="number"
                                    name="discountValue"
                                    value={formData.discountValue}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none
                                        ${errors.discountValue ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder={formData.discountType === 'percentage' ? 'e.g., 20' : 'e.g., 50'}
                                />
                                {errors.discountValue && (
                                    <p className="mt-1 text-sm text-red-500">{errors.discountValue}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Minimum Order Value
                            </label>
                            <input
                                type="number"
                                name="minimumOrderValue"
                                value={formData.minimumOrderValue}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="e.g., 100"
                            />
                        </div>

                        

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Usage Limit
                            </label>
                            <input
                                type="number"
                                name="usageLimit"
                                value={formData.usageLimit}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="e.g., 100"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="status"
                                checked={formData.status}
                                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.checked }))}
                                className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label className="text-sm text-gray-700">
                                Active Coupon
                            </label>
                        </div>

                        <div className="flex justify-end gap-4 pt-6">
                            <button
                                type="button"
                                onClick={() => window.history.back()}
                                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            >
                                save
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditCouponPage;