export const getStatusColor = (status) => {
    const statusClasses = {
      pending: "bg-amber-500 text-white", // Amber
      processing: "bg-blue-500 text-white", // Blue
      shipped: "bg-blue-600 text-white", // Bright Blue
      "out for delivery": "bg-cyan-500 text-white", // Cyan
      delivered: "bg-green-500 text-white", // Green
      returned: "bg-gray-500 text-white", // Gray
      cancelled: "bg-red-500 text-white", // Red
      "return-request": "bg-yellow-500 text-black", // Yellow
      "cancel-request": "bg-red-300 text-black", // Light Red
    };
  
    return statusClasses[status.toLowerCase()] || "#0000"; // Default to black if status not found
}