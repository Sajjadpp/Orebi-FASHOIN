import { MdClose } from "react-icons/md";
export default function NetworkAlert({setNetwork, text}) {
    console.log('working    ')
  return (
    <div className="bg-yellow-100 p-4 w-full">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        <p className="text-yellow-700">
            {text}
        </p>
        
        <button>
          <MdClose className="text-yellow-500 text-lg" onClick={()=>setNetwork(false) }/>
        </button>
      </div>
    </div>  
  );
}



