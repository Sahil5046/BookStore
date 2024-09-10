import React from "react";

const SeeUserData = ({ userDivData, userDiv, setUserDiv }) => {
  return (
    <div
      className={`bg-gray-800 ${userDiv} inset-0 z-50 flex items-center justify-center`}
    >
      <div className="bg-zinc-900 text-white rounded-lg shadow-lg p-6 w-[90%] md:w-[50%]">
        <h2 className="text-2xl font-bold mb-4">User Details</h2>

        {/* User Info Card */}
        <div className="mb-4">
          <h3 className="font-semibold text-lg">Name:</h3>
          <p>{userDivData.username}</p>
        </div>
        <div className="mb-4">
          <h3 className="font-semibold text-lg">Email:</h3>
          <p>{userDivData.email}</p>
        </div>
        <div className="mb-4">
          <h3 className="font-semibold text-lg">Address:</h3>
          <p>{userDivData.address}</p>
        </div>

        {/* Close Button */}
        <button
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          onClick={() => setUserDiv("hidden")}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SeeUserData;
