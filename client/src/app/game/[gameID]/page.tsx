"use client"
import { removeCookie,getCookie, getCookieAll, setCookie } from "@/lib/Cookies";
import { useRouter } from "next/navigation";
import {useState, useEffect} from "react";
import { useUser } from "@/lib/globalStates";
import socket from "@/socket";
type Props = {
  params: { gameID: string } 
}

export default function Page({ params }: Props) {
  const [verify, setVerify] = useState('false');
  const router = useRouter();
  const user = useUser(state=>state.user);
  const [game, setGame] = useState<IGame>();

  useEffect(()=>{

    socket.emit('getGame',params.gameID,(gameObj:IGame|null)=>{
      if(gameObj){
        setGame(gameObj);
      }
    })

    socket.on('updateGame', (gameObj:IGame)=>{
      console.log(gameObj)
      setGame(gameObj);
    })
  },[])
  


  const resign = ()=>{
    removeCookie('game').then(()=>{
      router.push('/lobby');
    });
    
  }

  return <div className="w-full h-screen bg-blue-600 text-white flex flex-col justify-center items-center">
    <div className="font-bold text-3xl">Waiting For Players...</div>
    GameID: {params.gameID}
    <div>
      {game?.players.map((player,index)=>{
        return <div key={index} className="">{player.username}</div>
      })}
    </div>
    <button className="bg-rose-400 p-4" onClick={resign}>Resign</button>
    </div>
}