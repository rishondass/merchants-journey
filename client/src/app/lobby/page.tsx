"use client";
import GameCard from "@/components/lobby/GameCard"
import socket from "@/socket";
import { FaUserAlt } from "react-icons/fa";
import { removeCookie,getCookie } from "@/lib/Cookies";
import {useRouter} from "next/navigation";
import {useEffect} from "react";

const page = () => {
  const router = useRouter();


  useEffect(()=>{
    if(!socket.connected){
      socket.auth = {id: getCookie('tok')?.value}
      socket.connect();
      console.log('reconnected');
    }
  },[])

  const logOff = ()=>{
    socket.close();
    removeCookie('tok'); 
    router.push("/");
  }

  return <div className="p-3 h-screen flex flex-col">
    <div className="flex justify-end">
      <div className="bg-bgGray rounded-md p-2 cursor-pointer" onClick={logOff}>
        <FaUserAlt size={28}/>
      </div>  
    </div>
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
