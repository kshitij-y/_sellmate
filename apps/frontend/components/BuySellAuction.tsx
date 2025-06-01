"use client";
import { ReactTyped } from "react-typed";

const BuySellAuction = () => {
  return (
    <div className="flex flex-col items-start justify-center mt-8 ml-6 bg-black text-white text-5xl font-extrabold tracking-wider space-y-4 p-4">
      <div>BUY</div>
      <div>SELL</div>
      <ReactTyped strings={["AUCTION"]} typeSpeed={70} backSpeed={70} loop/>
    </div>
  );
};

export default BuySellAuction;
