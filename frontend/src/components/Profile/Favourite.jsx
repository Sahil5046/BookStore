import React, { useEffect, useState } from "react";
import axios from "axios";
import BookCard from "../BookCard/BookCard";
import starImage from "../../assets/star.png"

function Favourite() {
  const [FavouriteBooks, setFavouriteBooks] = useState([]);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.get(
          "https://bookstore-7gww.onrender.com/api/v1/get-all-favorites-book",
          { headers }
        );
        setFavouriteBooks(response.data.data);
        // console.log(response.data.data);
      } catch (error) {
        console.error("Error fetching favourite books:", error);
      }
    };

    fetch();
  }, [FavouriteBooks]);

  return (
    <>
      { FavouriteBooks && FavouriteBooks.length === 0 && (
        <div className="font-semibold text-5xl w-full h-[100%] text-zinc-500 flex flex-col items-center justify-center">
          No Favourite Books
          <img src={starImage} alt="star" className="h-[20vh] my-8" />
        </div>
      )}
      <div className=" grid lg:grid-cols-4 gap-4">
        {FavouriteBooks &&
          FavouriteBooks.map((items, i) => (
            <div key={i}>
              <BookCard data={items} favourite={true} />
            </div>
          ))}
      </div>
    </>
  );
}

export default Favourite;
