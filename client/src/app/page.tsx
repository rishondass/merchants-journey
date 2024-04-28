"use client";
import { useEffect, useState } from "react";
import { useRouter, redirect } from "next/navigation";
import socket from "@/socket";
import {v4 as uuid} from 'uuid';
import {setCookie} from "@/lib/Cookies";
import { useUser } from "@/lib/globalStates";

export default function Home() {
  
  const [username, setUserName] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const {setUser} = useUser();
  useEffect(() => {
    // if(localStorage.getItem('tok')&&localStorage.getItem('tok_exp')){
    //   const token = localStorage.getItem('tok');
    //   const expires = parseInt(localStorage.getItem('tok_exp')??"");

    //   if((new Date().getTime())<expires){
    //     redirect('/lobby');
    //   }
    // }

    

    socket.once("authToken", (userID:string, username:string,gameID:string,token:string,expires:number) => {
      setUser({username:username,userID:userID,gameID:gameID});
      setCookie("tok",token,expires);
      router.push("/lobby");
      console.log('authing...')
    });


    

    socket.on("connect_error", (err) => {
      if (err.message === "invalid username") {
        setError("Error: nickname currently in use, please use a different name")
      }
    });
    
    
  }, []);

  const onUserNameSelection = () => {
    socket.auth = {username};
    socket.connect();
    
  };

  return (
    <div className="h-screen flex flex-col p-3">
      {error&&<div className="text-center text-white bg-rose-500 rounded-md text-lg py-2">{error}</div>}
      <div className="pt-28">{/* TODO: add learn button/module */}</div>
      <div className="font-papyrus text-6xl text-center">
        Merchant&apos;s Journey
      </div>
      <div className="flex justify-center pt-4">
        <input
          type="text"
          className="border-2 rounded-md bg-bgGray p-3 outline-none"
          placeholder="nickname"
          onChange={(e)=>{setUserName(e.target.value)}}
        />
      </div>
      <div className="text-center pt-2">
        <button className="bg-emerald-400 text-white px-4 py-2 rounded-md" onClick={onUserNameSelection}>
          continue
        </button>
      </div>
      <div className="flex flex-col justify-end items-center text-center h-full text-gray-400">
        <div className="w-[40rem] text-balance py-2">
          <p>Disclaimer:</p>
          <p>
            Merchant&apos;s Journey is a distinct and original game inspired by the
            rich history of trade along the Silk Road. While it shares thematic
            elements with Century: Spice Roads, Merchant&apos;s Journey is a unique
            creation with its own gameplay mechanics, components, and design.
            This game is not affiliated with or endorsed by Century: Spice Roads
            or its creators, and any similarities are coincidental. Enjoy the
            journey and experience of Merchant&apos;s Journey as a standalone board
            game adventure.
          </p>
        </div>
      </div>
    </div>
  );
}
