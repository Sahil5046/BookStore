import axios from "axios";
import React, { useEffect, useState } from "react";
import Loader from "../Loader/Loader";
function Setting() {
  const [ProfileData, setProfileData] = useState();
  const [Values, setValues] = useState({ address: "" });

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const change = (e) => {
    const { name, value } = e.target;
    setValues({ ...Values, [name]: value });
  };

  const handleAddress = async () => {
    const response = await axios.put(
      "https://bookstore-7gww.onrender.com/api/v1/update-address",
      Values,
      { headers }
    );
    alert(response.data.message);
  };

  useEffect(() => {
    const fetch = async () => {
      const response = await axios.get(
        "https://bookstore-7gww.onrender.com/api/v1/get-userdetails",
        { headers }
      );

      setProfileData(response.data);
      setValues({ address: response.data.address });
    };
    fetch();
  }, []);

  return (
    <>
      {!ProfileData && (
        <div className="flex items-center justify-center h-[100%]">
          <Loader />
        </div>
      )}{" "}
      {ProfileData && (
        <div className="h-[100%] p-0 md:p-4 text-zinc-100">
          <h1 className=" text-3xl md:text-5xl font-semibold text-zinc-500 mb-8">
            Settings
          </h1>

          <div className="flex gap-12">
            <label htmlFor="">Username</label>
            <p className="p-2 rounded bg-zinc-800 mt-2 font-semibold">
              {ProfileData.username}
            </p>
          </div>
          <div className="">
            <label htmlFor="">Email</label>
            <p className="p-2 rounded bg-zinc-800 mt-2 font-semibold">
              {ProfileData.email}
            </p>
          </div>
          <div className="mt-4 flex flex-col">
            <label htmlFor="">Address</label>
            <textarea
              name="address"
              rows="5"
              value={Values.address}
              placeholder="Address"
              className="p-2 rounded bg-zinc-800 mt-2 font-semibold"
              onChange={change}
              id=""
            ></textarea>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              className="bg-yellow-500 text-zinc-900 font-semibold px-3 py-2 rounded hover:bg-yellow-400"
              onClick={handleAddress}
            >
              Update
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Setting;
