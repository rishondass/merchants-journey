import React from 'react'
import PlayerCard from './PlayerCard';
import socket from "@/socket";
import {setCookie } from "@/lib/Cookies";
import {useRouter} from "next/navigation";
import { useUser } from '@/lib/globalStates';
type props = {
  gameID: string,
  roomNumber: number,
  gameTime: number,
  players: IPlayer[],
  maxPlayers:number,
}


const GameCard = ({gameID, roomNumber,gameTime,players,maxPlayers}:props) => {
  const router = useRouter();
  const [user,setUser] = useUser(state=>[state.user,state.setUser])
  const joinRoom = ()=>{
    socket.emit('joinGame',gameID,(status:{code:number,msg:string})=>{
      if(status.code!==200){
        console.log(status.msg);
      }else{
        setUser({...user,gameID:gameID})
        router.push('/game/'+gameID);
      }
    })
    
  }

  return (
    <div className="bg-bgGray w-96 rounded-md min-h-[292px] relative">
      <div className='text-center py-4 font-bold text-lg'>Room #{roomNumber}</div>
      <div className="flex p-2 h-44">
        <div className="bg-white w-full p-1 rounded-md ">
          <div className="font-semibold">Game:</div>
          <div >
            {gameTime===300&&<div>Time: Quick (5mins)</div>}
            {gameTime===600&&<div>Time: Regular (10mins)</div>}
            {gameTime===1200&&<div>Time: Long (20mins)</div>}
            <div>Max Players: {maxPlayers}</div>
          </div>
          
        </div>
        <div>
          {players.map((player,index) =>{
            if(index==0)
              return <PlayerCard key={index} name={player.username} isHost={true}/>
            else
              return <PlayerCard key={index} name={player.username}/>
          })}
        </div>
        
      </div>
      <div className="absolute bottom-2 w-full flex justify-center">
        {players.length>=maxPlayers?
          <button className="bg-gray-600 text-white px-8 py-2 rounded-md">
            join
          </button>:
          <button className="bg-cyan-600 text-white px-8 py-2 rounded-md" onClick={joinRoom}>
            join
          </button>
        }
        
      </div>
    </div>
  )
}

export default GameCard