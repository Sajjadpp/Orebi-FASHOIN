import { MdClose } from "react-icons/md";
import { useNavigate } from "react-router-dom";
export default function VerificationAlert({setWarning}) {
  const Navigate = useNavigate()
  return (
    <div className="bg-yellow-100 p-4 w-full">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        <p className="text-yellow-700">
          You are not verified correctly. Please verify your account.
        </p>
        <button className="bg-yellow-500 text-white px-4 py-2 rounded" onClick={()=> Navigate("/verify")}>
          Verify Now
        </button>
        <button>
          <MdClose className="text-yellow-500 text-lg" onClick={()=>setWarning(false) }/>
        </button>
      </div>
    </div>  
  );
}