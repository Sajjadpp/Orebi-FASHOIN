import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminAxiosInstance } from "../../../redux/constants/AxiosInstance";
import { formatTimestampToDate } from "../../../services/DateMaker/DateMaker";

const OfferListing = () => {
  // Sample data for offers
  const [offers, setOffers] = useState([]);

  const fetchOffer = async() =>{
    try{
        let response = await adminAxiosInstance.get('/offer');
        setOffers(response.data)
    }
    catch(error){
        console.log(error);
    }
  }

  useEffect(()=>{
    fetchOffer()
  },[])

  const navigate = useNavigate()

  const handleDeleteOffer = async(offerId) =>{

    try{
        let response = await adminAxiosInstance.delete(`/offer/${offerId}`);
        fetchOffer()
    }
    catch(error){
        console.log(error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Offer Listing</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          onClick={() => navigate('/admin/addOffer')}
        >
          Add Offer
        </button>
      </div>
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-3 border-b text-gray-600 font-semibold">Title</th>
              <th className="px-6 py-3 border-b text-gray-600 font-semibold">Type</th>
              <th className="px-6 py-3 border-b text-gray-600 font-semibold">Applicable To</th>
              <th className="px-6 py-3 border-b text-gray-600 font-semibold">Discount</th>
              <th className="px-6 py-3 border-b text-gray-600 font-semibold">Valid From</th>
              <th className="px-6 py-3 border-b text-gray-600 font-semibold">Valid Until</th>
              <th className="px-6 py-3 border-b text-gray-600 font-semibold">Status</th>
              <th className="px-6 py-3 border-b text-gray-600 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {offers.map((offer) => (
              <tr key={offer._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 border-b">{offer.title}</td>
                <td className="px-6 py-4 border-b">{offer.applicableType}</td>
                <td className="px-6 py-4 border-b">{offer.applicableName}</td>
                <td className="px-6 py-4 border-b">{offer.discountPercentage}%</td>
                <td className="px-6 py-4 border-b">{formatTimestampToDate(offer.validFrom) }</td>
                <td className="px-6 py-4 border-b">{formatTimestampToDate(offer.validUntil)}</td>
                <td className="px-6 py-4 border-b">
                  <span
                    className={`px-2 py-1 text-sm rounded-lg ${
                      offer.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {offer.status}
                  </span>
                </td>
                <td className="px-6 py-4 border-b">
                  
                <button
                    className="text-red-600 hover:underline"
                    onClick={() => handleDeleteOffer(offer._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OfferListing;
