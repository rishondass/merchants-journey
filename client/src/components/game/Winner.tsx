"use client";
import {useState,useEffect} from "react";
import Image from "next/image";
import {useRouter} from "next/navigation";
import { useUser } from "@/lib/globalStates";
type Props = {
  podium : podium
}


const Winner = ({podium}:Props) => {
  const [user, setUser] = useUser(state=>[state.user,state.setUser])
  const router = useRouter();
  useEffect(()=>{
    setUser({...user,gameID:undefined});
    setTimeout(()=>{
      router.push("/lobby");
    },1000);
  },[])

  return (
    <div className='bg-blue-600 w-screen h-screen text-white flex justify-center items-center'>
      <div className="flex justify-center flex-col items-center">
        <div className="text-center font-bold text-3xl">
          Winners!
        </div>
        {podium.map((player,index)=>{
          return <div className="flex items-center gap-2 p-2" key={index}>
            {index === 0 && <><Image src={"/medals/first.svg"} width={32} height={32} alt={"1st place"}/></>}
            {index === 1 && <Image src={"/medals/second.svg"} width={32} height={32} alt={"2nd place"}/>}
            {index === 2 && <Image src={"/medals/third.svg"} width={32} height={32} alt={"3rd place"}/>}
            {player.username}
            <div className={"text-lg text-yellow-400 font-bold"}>{player.totalPoints}</div>
          </div>
        })}
        <div className="pt-10">
        <button className="bg-rose-400 rounded-md p-4 w-24" onClick={()=>{router.replace("/lobby")}}>lobby</button>
        </div>
      </div>
    </div>
  )
}

export default Winner