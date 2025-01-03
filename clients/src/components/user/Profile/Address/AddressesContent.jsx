import { useSelector } from "react-redux";
import { fetchData } from "../../../../services/fetchData/fetchData";
import { useEffect, useState } from "react";
import EditAddress from "./EditAddress";
import { FaLessThanEqual } from "react-icons/fa";
import Confirmation from "../../../../assets/elements/Confirmation";
import { userAxiosInstance } from "../../../../redux/constants/AxiosInstance";
import toast from "react-hot-toast";

const AddressesContent = () => {
  const userId = useSelector(state => state.userReducer.user._id);
  const [addresses, setAddress] = useState([])
  const [editAddress, setEditAddress] = useState(false)
  const [deletePopup, setDeletePopup] = useState(false)
  const [addAddressPopup, setAddAddressPopup] = useState(false)

  const fetchAddress = async(req, res) =>{
    let response = await fetchData("address",{userId})
    console.log(response)
    setAddress(response)
  }
  console.log(addresses)
  useEffect(()=>{
    fetchAddress()
  },[userId])

  const handleDelete =async() =>{

    try{
      let response = await userAxiosInstance.delete('/address', {
        params: {
          _id: deletePopup
        }
      })
      console.log(response);
      toast.success(response.data)
      fetchAddress();
      setDeletePopup(false)
    }
    catch(error){
      toast.error(error.response.data)
    }
  }
 
  return (
    <>
      <EditAddress 
        initialAddress={editAddress}  
        isOpen={editAddress} 
        onClose={()=> setEditAddress(false)}
        refreshData={()=> fetchAddress()}
      />
      <Confirmation 
        isOpen={deletePopup}
        buttonText={'delete'}
        onConfirm={handleDelete}
        data={'are you sure to delete this address'}
        onClose={()=> setDeletePopup(false)}
      />
      <h1 className="text-2xl font-bold mb-6">My Addresses</h1>
      <div className="grid grid-cols-2 gap-6">
        {addresses.map((address) => (
          <div key={address._id} className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold mb-2"> {address.name}</h3>
            <p className="text-gray-600">
              {address.fullAddress}<br />
              {address.place}<br />
              {address.state}
            </p>
            <div className="mt-4 space-x-4">
              <button className="text-blue-600 hover:underline" onClick={()=> setEditAddress(address)}>Edit</button>
              <button className="text-red-600 hover:underline" onClick={()=> setDeletePopup(address._id ?? true)}>Delete</button>
            </div>
          </div>
        ))}
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold mb-2"> ...</h3>
            <p className="text-gray-600">
              .....<br />
              ....<br />
              .....
            </p>
            <div className="mt-4 space-x-4">
              {/* {/* <button className="text-blue-600 hover:underline" onClick={()=> setEditAddress(address)}>Edit</button> */}
              <button className="text-red-600 hover:underline"
              onClick={()=> setAddAddressPopup(true)}>add new</button>
            </div>
          </div>
      </div>
    </>
    )
};

export default AddressesContent