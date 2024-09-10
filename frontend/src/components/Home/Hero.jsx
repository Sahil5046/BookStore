import React from "react";
import hero from "../../assets/hero.png";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <div className=" h-[75vh] flex flex-col md:flex-row items-center justify-center">
      <div className="w-full mb-12 md:mb-0 lg:w-3/6 flex flex-col items-center lg:items-start justify-center">
        <h1 className="text-4xl lg:text-6xl font-semibold text-yellow-100 text-center lg:text-left">
          Discover Your Next Great Read
        </h1>
        <p className="mt-4 text-xl text-zinc-300 lg:text-left text-center">
          Uncover captivating stories, enriching knowledge, and endless
          inspiration in out curated collection of Book
        </p>
        <div className="mt-8">
          <Link
            to="/all-books"
            className="border border-yellow-100  font-semibold text-xl lg:text-2xl text-yellow-100 px-10 py-3 hover:bg-purple-400 rounded-full transition duration-700  hover:ease-in-out hover:scale-150"
          >
            Discover more
          </Link>
        </div>
      </div>
      <div className="lg:w-3/6 w-full lg:h-[100%] h-auto flex items-center justify-center">
        <img src={hero} alt="" />
      </div>
    </div>
  );
}

export default Hero;
