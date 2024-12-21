const ProfileContent = () => {
    const stats = [
      { label: "Orders", value: "12" },
      { label: "Wallet", value: "3" },
      { label: "Points", value: "250" }
    ];
  
    return (
      <>
        <h1 className="text-2xl font-bold mb-6">Profile Information</h1>
        
        <div className="grid grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-gray-500 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
  
        <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
              <input type="text" defaultValue="John" className="w-full p-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
              <input type="text" defaultValue="Doe" className="w-full p-2 border rounded-md" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input type="email" defaultValue="john.doe@example.com" className="w-full p-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input type="tel" defaultValue="+1 234 567 8900" className="w-full p-2 border rounded-md" />
          </div>
          <button className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800">
            Save Changes
          </button>
        </div>
      </>
    );
  };

export default ProfileContent