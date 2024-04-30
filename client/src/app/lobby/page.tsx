"use client";
import GameCard from "@/components/lobby/GameCard"
import socket from "@/socket";
import { FaUserAlt } from "react-icons/fa";
import { removeCookie,getCookie, getCookieAll, setCookie } from "@/lib/Cookies";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import CreateModal from "@/components/lobby/CreateModal";
import { useUser } from "@/lib/globalStates";
const page = () => {
  const [user,setUser] = useUser(state=>[state.user,state.setUser]);
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

    socket.on("authToken", (userID:string, username:string,gameID:string,token:string,expires:number) => {
      setUser({username:username,userID:userID,gameID:gameID});
      console.log('authing in lobby...')
    });

    socket.emit('getGames',(games:IGame[])=>{
      if(games){
        setGames(games);
      }
      
    })

    socket.on('updateLobby',(type:string,gameObj:IGame)=>{
      if(type === "CREATE"){
        setGames((prev)=>{
          return [...prev,gameObj]
        });
      }
      else if(type === "UPDATE"){
        setGames((prev)=>{
          const index = prev.findIndex(game=>{return game.gameID === gameObj.gameID});
          const temp = prev;
          temp[index] = gameObj;
          return temp;
        });
      }
      else if(type === "DELETE"){
        console.log(`Deleting game...`);
        console.log(gameObj);
        setGames((prev)=>{
          const temp = prev.filter(game=>{return game.gameID !== gameObj.gameID});
          return temp;
        })
      }
    })

    return (()=>{
      socket.off("authToken");
      socket.off("updateLobby");
    })

  },[])

  // useEffect(()=>{
  //   console.log(games);
  // },[games])

  const toggleModal = ()=>{
    setCreateModal(!createModal);
  }

  const logOff = async()=>{
    socket.emit("logOff");
    socket.close();
    await removeCookie('tok'); 
    router.push("/");
  }

  return <div className="p-3 h-screen flex flex-col relative">
    {createModal&& <CreateModal toggleModal={toggleModal}/>}
    <div className="flex justify-end">
      <div className="bg-bgGray rounded-md p-2 cursor-pointer flex" onClick={logOff}>
        <FaUserAlt size={28}/>
        <div>{user.username} {user.gameID}</div>
      </div>  
    </div>
    <div className="flex justify-center pt-10">
        <button className="bg-emerald-400 text-white px-4 py-2 rounded-md" onClick={toggleModal}>
          create
        </button>
    </div>
    <div>
      {games.map((game,index)=>{
        return <GameCard key={index} gameID={game.gameID} roomNumber={++index} gameTime={game.gameTime} maxPlayers={game.maxPlayers} players={game.players}/>
      })}
    </div>
  </div>;
};

export default page;
