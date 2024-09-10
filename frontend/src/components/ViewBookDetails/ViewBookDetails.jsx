import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loader from "../Loader/Loader";
import { GrLanguage } from "react-icons/gr";
import { FaHeart } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";
import { useSelector } from "react-redux";

function ViewBookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [Data, setData] = useState();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const role = useSelector((state) => state.auth.role);

  useEffect(() => {
    // Fetch data from API
    const fetch = async () => {
      const response = await axios.get(
        `https://bookstore-7gww.onrender.com/api/v1/get-book-by-id/${id}`
      );

      setData(response.data.data);
    };
    fetch();
  }, []);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
    bookid: id,
  };
  const handelFavourite = async () => {
    const response = await axios.put(
      `https://bookstore-7gww.onrender.com/api/v1/add-book-to-favorite`,
      {},
      { headers }
    );
    alert(response.data.message);
  };

  const handelCart = async () => {
    const response = await axios.put(
      "https://bookstore-7gww.onrender.com/api/v1/add-book-to-cart",
      {},
      { headers }
    );
    alert(response.data.message);
  };

  const handleDelete = async () => {
    const response = await axios.delete(
      "https://bookstore-7gww.onrender.com/api/v1/delete-book",
      { headers }
    );
    alert(response.data.message);
    navigate("/all-books");
  };

  return (
    <>
      {Data && (
        <div className="px-4 md:px-12 py-8 bg-zinc-900 flex flex-col lg:flex-row gap-8">
          <div className=" w-full lg:w-3/6 ">
            {" "}
            <div className="flex flex-col lg:flex-row justify-around bg-zinc-800 p-12 rounded">
              <img
                src={Data.url}
                alt="/"
                className=" h-[50vh] md:h-[60vh] lg:h-[70vh] rounded"
              />
              {isLoggedIn === true && role === "user" && (
                <div className=" flex flex-col md:flex-row lg:flex-col items-center justify-between lg:justify-start mt-8 lg:mt-0">
                  <button
                    className=" bg-white rounded lg:rounded-full text-4xl lg:text-3xl p-3 text-red-500 flex items-center justify-center"
                    onClick={handelFavourite}
                  >
                    <FaHeart />{" "}
                    <span className="ms-4 block lg:hidden">Favourites</span>
                  </button>
                  <button
                    className=" text-white rounded lg:rounded-full text-4xl lg:text-3xl p-3 mt-8 md:mt-0 lg:mt-8 bg-blue-500 flex items-center justify-center"
                    onClick={handelCart}
                  >
                    <FaShoppingCart />{" "}
                    <span className="ms-4 block lg:hidden">Add To Cart</span>
                  </button>
                </div>
              )}

              {isLoggedIn === true && role === "admin" && (
                <div className=" flex flex-col md:flex-row lg:flex-col items-center justify-between lg:justify-start mt-8 lg:mt-0">
                  <Link to={`/update-book/${id}`} className=" bg-white rounded lg:rounded-full text-4xl lg:text-3xl p-3 flex items-center justify-center">
                    <FaRegEdit />{" "}
                    <span className="ms-4 block lg:hidden">Edit</span>
                  </Link>
                  <button
                    className=" text-red-500 rounded lg:rounded-full text-4xl lg:text-3xl p-3 mt-8 md:mt-0 lg:mt-8 bg-white flex items-center justify-center"
                    onClick={handleDelete}
                  >
                    <MdOutlineDelete />{" "}
                    <span className="ms-4 block lg:hidden">Delete Book</span>
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="p-4 w-full lg:w-3/6">
            <h1 className="text-4xl text-zinc-300 font-semibold">
              {Data.title}
            </h1>
            <p className="text-zinc-400 mt-1">{Data.author}</p>
            <p className="text-zinc-500 mt-4 text-xl">{Data.desc}</p>
            <p className="text-zinc-400 mt-4 flex items-center justify-start">
              <GrLanguage className=" me-3" />
              {Data.language}
            </p>
            <p className="text-zinc-100 mt-4 text-3xl font-semibold">
              {" "}
              Price: &#8377; {Data.price}{" "}
            </p>
          </div>
        </div>
      )}
      {!Data && (
        <div className="h-screen flex justify-center items-center bg-zinc-900">
          <Loader />{" "}
        </div>
      )}
    </>
  );
}

export default ViewBookDetails;
