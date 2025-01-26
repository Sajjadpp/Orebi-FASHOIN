import React, { useEffect, useState } from 'react';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { adminAxiosInstance } from '../../../redux/constants/AxiosInstance';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const CouponPage = () => {
  const navigate = useNavigate();
  const [coupons, setCoupons] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of items per page

  const fetchCoupon = async () => {
    try {
      const response = await adminAxiosInstance.get('/coupon');
      setCoupons(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await adminAxiosInstance.delete(`/coupon/${id}`);
      toast.success('Coupon deleted');
      fetchCoupon();
    } catch (error) {
      console.log(error);
      toast.error('Error deleting coupon');
    }
  };

  useEffect(() => {
    fetchCoupon();
  }, []);

  // Pagination logic
  const totalItems = coupons.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCoupons = coupons.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Coupon Management</h1>
        <button
          onClick={() => navigate('/admin/addCoupon')}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          Add Coupon
        </button>
      </div>

      {/* Coupon List */}
      <div className="grid gap-4">
        {paginatedCoupons.map((coupon, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{coupon.code}</h3>
                <div className="mt-2 space-y-1 text-sm text-gray-600">
                  <p>
                    Discount: {coupon.discountValue}
                    {coupon.discountType === 'percentage' ? '%' : 'IND'}
                  </p>
                  <p>Min. Order: ₹{coupon.minimumOrderValue}</p>
                  <p>
                    Valid: {new Date(coupon.startDate).toLocaleDateString()} -{' '}
                    {new Date(coupon.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-blue-500 hover:bg-blue-50 rounded">
                  <Edit
                    className="w-4 h-4"
                    onClick={() =>
                      navigate(`/admin/editCoupon/${coupon._id}`, {
                        state: coupon,
                      })
                    }
                  />
                </button>
                <button
                  className="p-2 text-red-500 hover:bg-red-50 rounded"
                  onClick={() => handleDelete(coupon._id)}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-lg ${
            currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          Previous
        </button>
        <span className="text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-lg ${
            currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CouponPage;
