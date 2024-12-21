import React from "react";
import { useNavigate } from "react-router-dom";

const BlockedPage = () => {
    const navigate = useNavigate()
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center bg-white p-8 rounded-lg shadow-lg">
        <div className="text-red-500 text-6xl mb-4">🚫</div>
        <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
        <p className="text-lg text-gray-700 mb-6">
          This page has been blocked by the administrator. Please contact the
          administrator for further assistance.
        </p>
        <a
          onClick={()=>navigate("/signin")}
          className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
        >
          Return to Login
        </a>
      </div>
    </div>
  );
};

export default BlockedPage;
