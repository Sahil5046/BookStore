import axios from "axios";
import React, { useEffect, useState } from "react";
import Loader from "../components/Loader/Loader";
import { FaUser } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import { FaLocationArrow } from "react-icons/fa";
import { Link } from "react-router-dom";
import SeeUserData from "./SeeUserData";

const AllOrders = () => {
  const [allOrders, setAllOrders] = useState();
  const [option, setOption] = useState(-1);
  const [value, setValue] = useState({ status: "" });
  const [userDiv, setUserDiv] = useState("hidden");
  const [userDivData, setUserDivdata] = useState("hidden");
  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };
  useEffect(() => {
    const fetch = async () => {
      const response = await axios.get(
        "https://bookstore-7gww.onrender.com/api/v1/get-all-orders",
        { headers }
      );
      setAllOrders(response.data.data);
    };
    fetch();
  }, [allOrders]);

  const setOptionButton = (i) => {
    setOption(i);
  };

  const change = (e) => {
    const { value } = e.target;
    // console.log(value);

    setValue({ status: value });
  };

  const submitChange = async (i) => {
    try {
      const id = allOrders[i]._id;
      // console.log(id);
      
      const response = await axios.put(
        `https://bookstore-7gww.onrender.com/api/v1/update-status/${id}`,
        value,
        { headers }
      );
      // console.log(response);
      
      alert(response.data.message);
    } catch (error) {
      alert(error.response.data.message);
    }
  };
  return (
    <>
      {!allOrders && (
        <div className="h-[100%] flex items-center justify-center">
          <Loader />
        </div>
      )}
      {allOrders && allOrders.length > 0 && (
        <div className="h-[100%] p-0 md:p-4 text-white">
          <h1 className="text-2xl md:text-5xl font-semibold text-white mb-4">
            All Orders
          </h1>
          <div className="mt-4 bg-zinc-800 w-full rounded px-4 py-2 flex gap-4 items-center justify-between">
            <div className="w-[3%]">
              <h1 className="text-center">Sr.</h1>
            </div>
            <div className="w-[22%]">
              <h1 className="">Books</h1>
            </div>
            <div className="w-[45%]">
              <h1 className="">Description</h1>
            </div>
            <div className="w-[9%]">
              <h1 className="">Price</h1>
            </div>
            <div className="w-[16%]">
              <h1 className="">Status</h1>
            </div>
            <div className="w-none md:w-[5%] hidden md:block">
              <FaUser />
            </div>
          </div>

          {allOrders &&
            allOrders.map((items, i) => (
              <div
                className="bg-zinc-600 w-full rounded py-2 px-4 flex gap-2 hover:bg-zinc-700 hover:cursor-pointer "
                key={i}
              >
                <div className="w-[3%] ">
                  <h1 className="text-center"> {i + 1} </h1>
                </div>
                <div className="w-[40%] md:w-[22%] ">
                  <Link
                    to={`/view-book-details/${items.book._id}`}
                    className="hover:text-blue-300"
                  >
                    {items.book.title}
                  </Link>
                </div>

                <div className="w-0 md:w-[45%] hidden md:block">
                  <h1>{items.book.desc.slice(0, 50)}...</h1>
                </div>

                <div className="w-[17%] md:w-[9%] ">
                  <h1 className="font-semibold font-xl">{items.book.price}</h1>
                </div>

                <div className="w-[30%] md:w-[16%] ">
                  <h1 className="font-semibold">
                    <button
                      className="hover:scale-105 transition-all duration-300 "
                      onClick={() => setOptionButton(i)}
                    >
                      {items.status === "Order Placed" ? (
                        <div className="text-yellow-200"> {items.status} </div>
                      ) : items.status === "Cancelled" ? (
                        <div className="text-red-400">{items.status}</div>
                      ) : (
                        <div className="text-green-200"> {items.status} </div>
                      )}
                    </button>
                    {option === i && (
                      <div className="flex">
                        <select
                          name="status"
                          id=""
                          className="bg-gray-600 rounded text-sm font-semibold"
                          onChange={change}
                          value={value.status}
                        >
                          {[
                            "Order Placed",
                            "Shipped",
                            "Delivered",
                            "Cancelled",
                          ].map((items, i) => (
                            <option value={items} key={i}>
                              {items}
                            </option>
                          ))}
                        </select>
                        <button
                          className="text-green-300 hover:text-pink-400 mx-2"
                          onClick={() => {
                            setOption(-1);
                            submitChange(i);
                          }}
                        >
                          <FaCheck />
                        </button>
                      </div>
                    )}
                  </h1>
                </div>
                <div className="w-[10%] md:w-[5%] ">
                  <button
                    className="text-xl hover:text-orange-300"
                    onClick={() => {
                      setUserDiv("fixed");
                      setUserDivdata(items.user);
                    }}
                  >
                    <FaLocationArrow />
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}

      {userDivData && (
        <SeeUserData
          userDivData={userDivData}
          userDiv={userDiv}
          setUserDiv={setUserDiv}
        />
      )}
    </>
  );
};

export default AllOrders;
