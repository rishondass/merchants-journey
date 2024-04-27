import React from 'react'
import PlayerCard from './PlayerCard'
type props = {
  gameID: string,
  roomNumber: number,
  gameTime: number,
  players: IPlayer[]
}

const GameCard = ({gameID, roomNumber,gameTime,players}:props) => {
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
            <div>Max Players: {players.length}</div>
          </div>
          
        </div>
        <div>
          {players.map((player,index) =>{
            if(player !== null){
              if(index==0)
                return <PlayerCard key={index} name={player.username} isHost={true}/>
              return <PlayerCard key={index} name={player.username}/>
            }
          })}
        </div>
        
      </div>
      <div className="absolute bottom-2 w-full flex justify-center">
        <button className="bg-cyan-600 text-white px-8 py-2 rounded-md">
          join
        </button>
      </div>
    </div>
  )
}

export default GameCard