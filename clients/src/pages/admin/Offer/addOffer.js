import React, { useState, useEffect } from "react";
import { adminAxiosInstance } from "../../../redux/constants/AxiosInstance";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddOffer = () => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        type: "product", // Default to 'product'
        applicableId: "",
        discountPercentage: "",
        validFrom: "",
        validUntil: "",
        usageLimitPerUser: 1,
    });

    const [options, setOptions] = useState([]); // For storing product or category options
    const navigate = useNavigate()
    // Fetch products or categories based on the selected type
    useEffect(() => {
        const fetchOptions = async () => {
        try {
            const response = await adminAxiosInstance.get(`/${formData.type === "product" ? 'productList' : 'listCategory' }`); // API endpoint for products/categories
            
            setOptions(response.data); // Assuming `data` is an array of objects with `id` and `name`
        } catch (error) {
            console.error(`Error fetching ${formData.type}s:`, error);
        }
        };

        fetchOptions();
    }, [formData.type]);

    const handleChange = (e) => {
        const { name, value } = e.target;
    
        if (name === "applicableId") {
        // Find the selected option to get both _id and name
        const selectedOption = options.find((option) => option._id === value);
    
        setFormData({
            ...formData,
            [name]: value,
            applicableName: selectedOption ? selectedOption.name : "", // Add applicableName
        });
        } else if (name === "type") {
        // Reset applicableId and applicableName when type changes
        setFormData({ ...formData, [name]: value, applicableId: "", applicableName: "" });
        } else {
        setFormData({ ...formData, [name]: value });
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Send formData to the server
        try {
            const response = await adminAxiosInstance.post("/offer", formData);
            console.log("Offer added successfully:", response.data);
            toast.success(response.data)
            navigate('/admin/offer')
        } catch (error) {
            console.error("Error adding offer:", error);
            toast.error('try again later ')
        }
    };
    

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="bg-white shadow-md rounded-lg p-8 max-w-lg w-full">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Offer</h1>
            <form onSubmit={handleSubmit}>
            {/* Title */}
            <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Title</label>
                <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Enter offer title"
                className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-200"
                />
            </div>

            {/* Description */}
            <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Description</label>
                <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Enter offer description"
                className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-200"
                ></textarea>
            </div>

            {/* Type */}
            <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Type</label>
                <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-200"
                >
                <option value="product">Product</option>
                <option value="category">Category</option>
                </select>
            </div>

            {/* Applicable Product/Category */}
            <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                Applicable {formData.type === "product" ? "Product" : "Category"}
                </label>
                <select
                name="applicableId"
                value={formData.applicableId}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-200"
                >
                <option value="" disabled>
                    Select {formData.type}
                </option>
                {options.map((option) => (
                    <option key={option._id} value={option._id}>
                    {option.name}
                    </option>
                ))}
                </select>
            </div>

            {/* Discount Percentage */}
            <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Discount Percentage</label>
                <input
                type="number"
                name="discountPercentage"
                value={formData.discountPercentage}
                onChange={handleChange}
                required
                placeholder="Enter discount percentage"
                min="0"
                max="100"
                className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-200"
                />
            </div>

            {/* Valid From */}
            <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Valid From</label>
                <input
                type="date"
                name="validFrom"
                value={formData.validFrom}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-200"
                />
            </div>

            {/* Valid Until */}
            <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Valid Until</label>
                <input
                type="date"
                name="validUntil"
                value={formData.validUntil}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-200"
                />
            </div>
            
            {/* Submit Button */}
            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
                Add Offer
            </button>
            </form>
        </div>
        </div>
    );
};

export default AddOffer;
