"use client"
import { useRouter } from "next/navigation";
import {useState, useEffect} from "react";
import { useUser } from "@/lib/globalStates";
import { getCookie } from "@/lib/Cookies";
import socket from "@/socket";

type Props = {
  gameObj: IGame | undefined;
}

const WaitingRoom = ({gameObj}:Props) => {
  const router = useRouter();
  const [user,setUser] = useUser(state=>[state.user,state.setUser]);
  const [game, setGame] = useState<IGame | undefined>(gameObj);
  useEffect(()=>{

    // socket.emit('getGame',params.gameID,(gameObj:IGame|null)=>{
    //   if(gameObj){
    //     console.log(`PlayerID: ${user.userID}`)
    //     const player = gameObj.players.find(player=>{
    //       console.log(player.id)
    //       return player.id === user.userID});
    //     console.log(player);
    //     if(player){
    //       setGame(gameObj);
    //     }else{
    //       //router.replace('/unauthorized')
    //     }
        
    //   }
    // })


    socket.on('updateGameDetails', (gameObj:IGame)=>{
      console.log(gameObj)
      setGame(gameObj);
    })

    socket.on('gameClose',()=>{
      router.push('/lobby');
      setUser({...user, gameID:undefined})
    })

  },[])




  const leave = ()=>{
    if(game){
      if(game.players[0].id===user.userID){
        socket.emit('deleteGame', game.gameID, (res:{status:number,msg:string})=>{
          if(res.status !== 200){
            console.log(res.msg);
          }else{
            router.push('/lobby');
            setUser({...user, gameID:undefined})
            
          }
        })
      }else{
        socket.emit('leaveGame',game.gameID,(res:{code:number,msg:string})=>{
          if(res.code !== 200){
            console.log(res.msg);
          }else{
            router.push('/lobby');
            setUser({...user, gameID:undefined})
          }
        });
      }
    }
  
    
    
  }

  const start = ()=>{

  }

  
  return <div className="w-full h-screen bg-blue-600 text-white flex flex-col justify-center items-center">
    <div className="font-bold text-3xl p-10">Waiting For Players...</div>
    
    
    <div className="flex gap-3">
      {game?.players.map((player,index)=>{
        return <div key={index} className="bg-bgGray px-3 py-2 text-black rounded-md w-32 text-nowrap text-center overflow-hidden">
        {player.username}
      </div>
      })}
    </div>
    <div className="flex gap-4 pt-10">
      <button className="bg-rose-500 p-4 rounded-md w-24" onClick={leave}>Leave</button>
      {game&&game.players[0].id === user.userID&&game.players.length === game.maxPlayers && 
        <button className="bg-emerald-400 rounded-md p-4 w-24" onClick={start}>start</button>
      }
      
    </div>
    
    </div>
}

export default WaitingRoom