"use client";
import GameCard from "@/components/lobby/GameCard"
import socket from "@/socket";

const page = () => {
  return <div className="p-3 h-screen flex flex-col">
    <div className="flex justify-center pt-10">
        <button className="bg-emerald-400 text-white px-4 py-2 rounded-md">
          create
        </button>
    </div>
    <div>
      <GameCard/>
    </div>
  </div>;
};

export default page;
