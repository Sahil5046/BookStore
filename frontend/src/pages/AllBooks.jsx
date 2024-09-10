import React, { useEffect, useState } from "react";
import Loader from "../components/Loader/Loader";
import axios from "axios";
import BookCard from "../components/BookCard/BookCard";

function AllBooks() {
  const [Data, setData] = useState();

  useEffect(() => {
    // Fetch data from API
    const fetch = async () => {
      const response = await axios.get(
        "http://localhost:1000/api/v1/get-all-books"
      );
      setData(response.data.data);
    };
    fetch();
  }, []);

  return (
    <div className="bg-zinc-900 text-white h-auto px-12 py-8">
      <h4 className="text-3xl text-yellow-100">All books</h4>
      {!Data && (
        <div className="w-full h-screen flex items-center justify-center bg-zinc-700">
          <Loader />
        </div>
      )}
      <div className="my-8 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {Data &&
          Data.map((items, i) => (
            <div key={i}>
              {" "}
              <BookCard data={items} />{" "}
            </div>
          ))}
      </div>
    </div>
  );
}

export default AllBooks;
