const AddressesContent = () => (
    <>
      <h1 className="text-2xl font-bold mb-6">My Addresses</h1>
      <div className="grid grid-cols-2 gap-6">
        {[1, 2].map((address) => (
          <div key={address} className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold mb-2">Address {address}</h3>
            <p className="text-gray-600">
              123 Main Street, Apt {address}01<br />
              New York, NY 10001<br />
              United States
            </p>
            <div className="mt-4 space-x-4">
              <button className="text-blue-600 hover:underline">Edit</button>
              <button className="text-red-600 hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );

export default AddressesContent