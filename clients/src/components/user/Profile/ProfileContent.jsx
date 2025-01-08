import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userValidation } from "./Validations/userValidations";
import { AuthAxiosInstance, userAxiosInstance } from "../../../redux/constants/AxiosInstance";
import toast from "react-hot-toast";
import { SaveUser, updateUser } from "../../../redux/slices/userSlice";

const ProfileContent = () => {
  const user = useSelector((state) => state.userReducer.user);
  const dispatch = useDispatch()
  let [firstName, lastName] = user.username.split(" ");
  const [formData, setFormData] = useState({
    _id: user._id,
    email: user.email,
    firstName: firstName,
    lastName: lastName,
    mobileNo: user.mobileNo || null,
  });
  const [userDetails, setUserDetails] = useState(null)
  const [errors, setErrors] = useState({}); // State to store error messages

  const [stats, setStats] = useState([
    { label: "Orders", value: userDetails?.OrdersCount ?? 0 },
    { label: "Wallet", value: userDetails?.AddressCount ?? 0 },
    { label: "Points", value: userDetails?.points ?? 0 },
  ]);

  const fetchAddress = async() =>{
    console.log("fetch address working")
    try{
      let response = await userAxiosInstance.get('/profile',{
        params:{
          _id: user._id
        }
      })
      console.log(response.data,"prfle thngs");
      setUserDetails(response.data)
      console.log(userDetails,"prfle thngs");
      setStats([])
    }
    catch(error){
      console.log('workinge erroor')
      console.log(error)
    }
  }

  const handleSubmit = async() => {
    const validationErrors = userValidation(formData); // Validate the form data
    if (validationErrors) return setErrors(validationErrors); // Set error messages in state
    setErrors({});

    try{

      let response = await userAxiosInstance.put('/user',formData);
      dispatch(updateUser({mobileNo: formData.mobileNo, username: response.data}))
      toast.success("user updated successfully");

    }
    catch(error){
      toast.error(error.response.data || error.message)
    }
    
  };

  useEffect(()=>{
    console.log('working profile useEffect')
    fetchAddress()
  },[user])

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Profile Information</h1>

      <div className="grid grid-cols-2 gap-6 mb-8">
        {userDetails?.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm flex items-center justify-center flex-col">
            <div className="text-2xl font-bold">{stat.count}</div>
            <div className="text-gray-500 text-sm">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              className="w-full p-2 border rounded-md"
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            className="w-full p-2 border rounded-md"
            disabled
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone
          </label>
          <input
            type="tel"
            value={formData.mobileNo}
            onChange={(e) =>
              setFormData({ ...formData, mobileNo: e.target.value })
            }
            className="w-full p-2 border rounded-md"
          />
          {errors.mobileNo && (
            <p className="text-red-500 text-sm mt-1">{errors.mobileNo}</p>
          )}
        </div>
        <button
          className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800"
          onClick={handleSubmit}
        >
          Save Changes
        </button>
      </div>
    </>
  );
};

export default ProfileContent;
