import React, { useEffect, useState } from 'react';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { adminAxiosInstance } from '../../../redux/constants/AxiosInstance';
import {useNavigate} from 'react-router-dom'
import toast from 'react-hot-toast';

const CouponPage = () => {
  const navigate = useNavigate()
  const [coupons, setCoupons] = useState([
    {
      code: 'SUMMER2025',
      discountType: 'percentage',
      discountValue: 20,
      minimumOrderValue: 100,
      startDate: '2025-06-01',
      endDate: '2025-08-31',
      usageLimit: 100,
      status: true,
    },
  ]);

  const fetchCoupon = async() =>{
    try{
        const response = await adminAxiosInstance.get('/coupon');
        setCoupons(response.data)

    }
    catch(error){
        console.log(error);
    }
  }
  const handleDelete = async(id) =>{
    try{
      console.log()
      await adminAxiosInstance.delete(`/coupon/${id}`)
      toast.success('coupon deleted')
      fetchCoupon()
    }
    catch(error){
      console.log(error)
      toast.error('error')
    }
  }

  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: '',
    minimumOrderValue: '',
    startDate: '',
    endDate: '',
    usageLimit: '',
    status: true,
  });

  

  useEffect(() =>{
    fetchCoupon();
  },[])


  

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
        {coupons.map((coupon, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{coupon.code}</h3>
                <div className="mt-2 space-y-1 text-sm text-gray-600">
                  <p>Discount: {coupon.discountValue}{coupon.discountType === 'percentage' ? '%' : ' USD'}</p>
                  <p>Min. Order: ${coupon.minimumOrderValue}</p>
                  <p>Valid: {new Date(coupon.startDate).toLocaleDateString()} - {new Date(coupon.endDate).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-blue-500 hover:bg-blue-50 rounded">
                  <Edit className="w-4 h-4" onClick={()=> navigate(`/admin/editCoupon/${coupon._id}`,{
                    state: coupon
                  })}/>
                </button>
                <button className="p-2 text-red-500 hover:bg-red-50 rounded" onClick={()=> handleDelete(coupon._id)}>
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Coupon Modal */}
      
    </div>
  );
};

export default CouponPage;