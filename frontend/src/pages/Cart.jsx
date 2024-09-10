import React, { useEffect, useState } from "react";
import Loader from "../components/Loader/Loader";
import EmptyCart from "../assets/empty-cart.png";
import axios from "axios";
import { MdDeleteOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";

function Cart() {
  const [Cart, setCart] = useState([]);
  const [Total, setTotal] = useState(0);
  const navigate = useNavigate();
  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const deleteItem = async (id) => {
    try {
      const response = await axios.delete(
        `https://bookstore-7gww.onrender.com/api/v1/remove-book-from-cart/${id}`,
        { headers }
      );
      setCart(Cart.filter((item) => item._id !== id));
      alert(response.data.message);
    } catch (error) {
      console.error(error);
    }
  };

  const placeOrder = async () => {
    try {
      const response = await axios.post(
        `https://bookstore-7gww.onrender.com/api/v1/place-order`,
        { order: Cart },
        { headers }
      );
      alert(response.data.message);
      navigate("/profile/orderHistory");
    } catch (error) {
      console.error(
        "Error placing order:",
        error.response?.data || error.message
      );
      alert(
        "Failed to place order: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get(
          "https://bookstore-7gww.onrender.com/api/v1/get-all-cart-book",
          { headers }
        );
        setCart(response.data.data);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };
    fetchCart();
  }, [Cart]);

  useEffect(() => {
    if (Cart && Cart.length > 0) {
      let total = Cart.reduce((sum, item) => sum + item.price, 0);
      setTotal(total);
    }
  }, [Cart]);

  return (
    <div className="bg-zinc-700 px-4 sm:px-12 md:px-12 py-8 min-h-screen flex flex-col">
      {!Cart && (
        <div className="w-full h-[100%] flex items-center justify-center bg-zinc-700">
          <Loader />
        </div>
      )}

      {Cart && Cart.length === 0 && (
        <div className="h-screen bg-zinc-700">
          <div className="h-full flex items-center justify-center flex-col">
            <h1 className="text-5xl lg:text-6xl font-semibold text-zinc-400">
              Empty Cart
            </h1>
            <img
              src={EmptyCart}
              alt="empty-cart"
              className="lg:h-[50vh] opacity-50 rounded"
            />
          </div>
        </div>
      )}

      {Cart && Cart.length > 0 && (
        <div className="bg-zinc-700 min-h-screen p-4">
          <h1 className="text-3xl md:text-5xl font-semibold text-zinc-500 mb-8">
            Your Cart
          </h1>
          {Cart.map((items, i) => (
            <div
              key={i}
              className="w-full my-4 rounded flex flex-col md:flex-row p-4 items-center md:items-start justify-between border-2 hover:bg-zinc-800 border-zinc-800"
            >
              <img
                src={items.url}
                alt={items.title}
                className="h-[25vh] md:h-[15vh] lg:h-[10vh] object-cover"
              />
              <div className="w-full md:w-1/2 lg:w-2/3 mt-4 md:mt-0 md:ml-4 text-center md:text-left">
                <h1 className="text-xl md:text-2xl text-zinc-100 font-semibold">
                  {items.title}
                </h1>
                <p className="text-sm md:text-normal text-zinc-300 mt-2 hidden lg:block">
                  {items.desc.slice(0, 100)}...
                </p>
                <p className="text-sm md:text-normal text-zinc-300 mt-2 hidden md:block lg:hidden">
                  {items.desc.slice(0, 65)}...
                </p>
                <p className="text-sm text-zinc-300 mt-2 block md:hidden">
                  {items.desc.slice(0, 50)}...
                </p>
              </div>

              <div className="flex flex-col md:flex-row md:mt-0 mt-4 w-full md:w-auto items-center justify-between">
                <h2 className="text-zinc-100 font-semibold text-2xl md:text-3xl">
                  &#8377; {items.price}
                </h2>
                <button
                  className="bg-red-100 text-red-700 border border-red-700 rounded p-2 mt-4 md:mt-0 md:ml-4"
                  onClick={() => deleteItem(items._id)}
                >
                  <MdDeleteOutline />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {Cart && Cart.length > 0 && (
        <div className="mt-4 w-full flex items-center justify-end">
          <div className="p-4 bg-zinc-800 rounded">
            <h1 className="text-3xl md:text-2xl text-zinc-200 font-semibold">
              Total Amount
            </h1>
            <div className="mt-3 flex items-center justify-between text-xl text-zinc-200">
              <h2>{Cart.length} books </h2> <h2>&#8377; {Total}</h2>
            </div>
            <div className="w-full mt-3">
              <button
                className="bg-zinc-100 rounded px-4 py-2 flex justify-center w-full font-semibold hover:bg-zinc-700 hover:text-white"
                onClick={placeOrder}
              >
                Place Your Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
