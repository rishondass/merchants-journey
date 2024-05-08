import {useState, useEffect} from 'react'
import Image from "next/image";



const PlayerCard = ({activeCards,coins,gems,id,pointCards,restCards,username}:IPlayer) => {
  const [gemCount, setGemCount] = useState({yellow:0,green:0,blue:0,red:0});
  
  useEffect(()=>{
    const count = {yellow:0,green:0,blue:0,red:0}
    gems.map((gem,i)=>{
      if(gem === "Y")
        count.yellow += 1;
      else if(gem === "G")
        count.green += 1;
      else if(gem === "B")
        count.blue += 1;
      else if(gem === "R")
        count.red += 1;
    });
    setGemCount(count);
  },[gems])

  return <>
    <div className='w-full h-32 bg-zinc-800 rounded-md p-1 shadow-md text-white'>
      <div className='text-nowrap overflow-clip text-center'>{username}</div>
      <div className='flex gap-1 justify-center'>
        <div className='flex items-center'>
          <span>x{gemCount.yellow}</span>
          <Image src={"/gems/yellow.svg"} width={32} height={32} alt={"yellow-gem"}/>
        </div>
        <div className='flex items-center'>
          <span>x{gemCount.green}</span>
          <Image src={"/gems/green.svg"} width={32} height={32} alt={"green-gem"}/>
        </div>
        <div className='flex items-center'>
          <span>x{gemCount.blue}</span>
          <Image src={"/gems/blue.svg"} width={32} height={32} alt={"blue-gem"}/>
        </div>
        <div className='flex items-center'>
          <span>x{gemCount.red}</span>
          <Image src={"/gems/red.svg"} width={32} height={32} alt={"red-gem"}/>
        </div>
      </div>
      <div className='flex gap-1 justify-center'>
        <div className='flex w-8 h-11 bg-gray-400 rounded-sm text-white items-center justify-center'>
            x{restCards.length}
        </div>
        <div className='flex w-8 h-11 bg-blue-400 rounded-sm text-white items-center justify-center'>
          x{activeCards.length}
        </div>
        <div className='flex w-8 h-11 bg-red-400 rounded-sm text-white items-center justify-center'>
          x{pointCards.length}
        </div>
        <div className="flex justify-center items-center">
          <div className='relative'>
            <div className="absolute top-1 right-1 pr-2 pt-1 text-white">x{coins.copper}</div>
            <Image src={"/coins/Gold.svg"} width={42} height={42} alt="gold-coin"/>
          </div>
          
        </div>
        <div className="flex justify-center items-center">
          <div className='relative'>
            <div className="absolute top-1 right-1 pr-2 pt-1 text-white">x{coins.silver}</div>
            <Image src={"/coins/Silver.svg"} width={42} height={42} alt="gold-coin"/>
          </div>
          
        </div>
      </div>
    </div>
    
  </>
}

export default PlayerCard