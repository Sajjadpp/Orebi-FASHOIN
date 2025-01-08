import React from 'react'

const OrderAddress = ({isOpen, onClose, addressData}) => {
    if(!isOpen) return null
    console.log(addressData)
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">Address Details</h2>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  {addressData?.addressType}
                </span>
              </div>
              <button 
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">{addressData?.name}</h3>
                <p className="whitespace-pre-wrap text-gray-600">
                  {addressData?.fullAddress}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-medium text-gray-500">Place</p>
                  <p className="capitalize">{addressData?.place}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-500">Pincode</p>
                  <p>{addressData?.pincode}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-500">State</p>
                  <p>{addressData?.state}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-500">Country</p>
                  <p>{addressData?.country}</p>
                </div>
              </div>

              <div className="border-t pt-4 mt-4">
                <div className="text-sm text-gray-500">
                  <p>ID: {addressData?._id}</p>
                  <p>Created: {new Date(addressData?.createdAt).toLocaleDateString()}</p>
                  {addressData?.isDeleted && (
                    <p className="text-red-500 mt-2">This address has been deleted</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
    )
}

export default OrderAddress
