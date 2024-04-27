"use client";
import GameCard from "@/components/lobby/GameCard"
import socket from "@/socket";
import { FaUserAlt } from "react-icons/fa";
import { removeCookie,getCookie, getCookieAll } from "@/lib/Cookies";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import CreateModal from "@/components/lobby/CreateModal";

const page = () => {
  const router = useRouter();
  const [createModal ,setCreateModal] = useState(false);
  const [games, setGames] = useState<IGame[]>([]);
  useEffect(()=>{
    if(!socket.connected){
      
      getCookie('tok').then(cookie =>{
        socket.auth = {id: cookie?.value}
        socket.connect();
        console.log('reconnected');
      });
      
    }

    socket.emit('getGames',(games:IGame[])=>{
      console.log(games);
      if(games){
        setGames(games);
      }
      
    })

    socket.on('updateLobby',(gameObj)=>{
      const obj = gameObj as IGame;
      console.log("UPDATE",obj);
      setGames((prev)=>{
        return [...prev,obj]
      });
    })
  },[])

  useEffect(()=>{
    console.log(games);
  },[games])

  const toggleModal = ()=>{
    setCreateModal(!createModal);
  }

  const logOff = ()=>{
    socket.emit("logOff");
    socket.close();
    removeCookie('tok'); 
    router.push("/");
  }

  return <div className="p-3 h-screen flex flex-col relative">
    {createModal&& <CreateModal toggleModal={toggleModal}/>}
    <div className="flex justify-end">
      <div className="bg-bgGray rounded-md p-2 cursor-pointer" onClick={logOff}>
        <FaUserAlt size={28}/>
      </div>  
    </div>
    <div className="flex justify-center pt-10">
        <button className="bg-emerald-400 text-white px-4 py-2 rounded-md" onClick={toggleModal}>
          create
        </button>
    </div>
    <div>
      {games.map((game,index)=>{
        return <GameCard key={index} gameID={game.gameID} roomNumber={++index} gameTime={game.gameTime} players={game.players}/>
      })}
    </div>
  </div>;
};

export default page;
