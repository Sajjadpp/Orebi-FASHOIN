import { useState } from 'react';
import AddressPopup from './AddAddress';

const AddressSection = ({ addresses, selectedAddress, onAddressSelect, refreshData }) => {

    console.log(addresses)
    const [addAddressPopup, setAddAddressPopup] = useState(false);
    
    const handleAddAddress = ()=>{
      console.log('working');
      setAddAddressPopup(true)
    }
  
    const onCloseModal = ()=>{
      setAddAddressPopup(false)
      refreshData()
    }
    return (
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <AddressPopup 
          isOpen={addAddressPopup}
          onClose={onCloseModal}
  
        />
        <h2 className="text-xl font-semibold mb-4">Select Shipping Address</h2>
        {addresses?.map((address) => (
          <div key={address.id} className="mb-4">
            <label className="flex items-start space-x-3 p-4 border rounded hover:border-gray-400 cursor-pointer">
              <input
                type="radio"
                name="address"
                checked={selectedAddress === address._id}
                onChange={() => onAddressSelect(address._id)}
                className="mt-1"
              />
              <div>
                <p className="font-medium">{address.name}</p>
                <p className="text-gray-600">{address.street}</p>
                <p className="text-gray-600">{address.city}, {address.state}</p>
                <p className="text-gray-600">Phone: {address.phone}</p>
              </div>
            </label>
          </div>
        ))}
        <button className="mt-4 flex items-center text-blue-600 hover:text-blue-800" onClick={handleAddAddress}>
          <span className="mr-2">+</span> Add New Address
        </button>
      </div>
    );
  };

  export default AddressSection