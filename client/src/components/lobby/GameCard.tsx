import React from 'react'
import PlayerCard from './PlayerCard'
type Props = {
  roomID: string,
  roomNumber: number,
  gameTime: number,
  maxPlayers: number,
  playerCount: number
}

const GameCard = () => {
  return (
    <div className="bg-bgGray w-96 rounded-md min-h-[292px] relative">
      <div className='text-center py-4 font-bold text-lg'>Room #1</div>
      <div className="flex p-2 h-44">
        <div className="bg-white w-full p-1 rounded-md ">
          <div className="font-semibold">Game:</div>
          <div >
            <div>Time: Quick (5mins)</div>
            <div>Max Players: 5</div>
          </div>
          
        </div>
        <div>
          <PlayerCard name={"john"} isHost={true}/>
          <PlayerCard name={"alex"}/>
          <PlayerCard name={"dan"}/>
          <PlayerCard name={"ban"}/>
          <PlayerCard name={"tan"}/>
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