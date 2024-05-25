import React from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import { GiConfirmed } from "react-icons/gi";

function QusCard({ qus }) {
  function getLeetCodeTitle(url) {
    // Split the URL by '/' and get the last part
    const parts = url.split("/");
    const slug = parts[parts.length - 2];

    // Split the slug by '-' and capitalize each word
    const title = slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return title;
  }

  return (
    <div className=" mb-5 w-full h-[60px] rounded-[10px] flex items-center justify-between px-5 bg-opacity-6 shadow-lg backdrop-filter backdrop-blur-sm border border-black border-opacity-20 transition-all duration-100 ease-linear hover:shadow-2xl">
      <div className="flex gap-3 items-center w-[600px]">
        <GiConfirmed className="text-green-500 text-[25px]" />
        <h1 className="text-[20px] font-[500] ">{getLeetCodeTitle(qus.qus)}</h1>
        <FaExternalLinkAlt
          className="cursor-pointer"
          onClick={() => window.open(qus.qus, "_blank")}
        />
      </div>
      <div className="">
        <p className="text-lg text-black font-medium">Array</p>
      </div>
      <div className="">
        <p className="text-lg text-black font-medium">Easy</p>
      </div>
      <div className="">
        <p className="text-lg text-black font-medium">{qus.date}</p>
      </div>
    </div>
  );
}

export default QusCard;
