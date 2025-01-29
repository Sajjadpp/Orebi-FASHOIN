import React, { useEffect, useState } from "react";
import { Clock, CreditCard, Package, Truck } from "lucide-react";
import toast from "react-hot-toast";

// Return Modal Component
const ReturnModal = ({ isOpen, onClose, onConfirm }) => {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  
  const returnReasons = [
    "Defective product",
    "Wrong size/fit",
    "Not as described",
    "Changed mind",
    "Received wrong item",
    "Quality not as expected",
    "Other"
  ];

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!reason) {
      toast.error("Please select a return reason");
      return;
    }
    if (!details) {
      toast.error("Please provide additional details");
      return;
    }
    onConfirm({ reason, details });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Return Order</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Return Reason</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border rounded-md p-2"
            >
              <option value="">Select a reason</option>
              {returnReasons.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Additional Details</label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Please provide more details about your return request"
              className="w-full border rounded-md p-2 min-h-[100px]"
            />
          </div>
          
          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Submit Return Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnModal