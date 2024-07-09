import React from 'react'
import Image from 'next/image';
import { FaArrowDown } from "react-icons/fa";

type Props = {
  type: string,
  cardID: number,
  pointCard?: IPointCard;
  tradeCard?: ITradeCard;

}

const Card = ({type, cardID,pointCard,tradeCard}:Props) => {
  return (
    <div className=" rounded-md w-[110px] h-[167.75px] text-center relative">
      
      <Image src={`/cards/${type}/${cardID+1}.png`} alt={cardID+"-point-image"} fill={true} className={'object-fill rounded-md border-2 border-bgGray'}/>
      
      {type==="point"&&
        <div className={"absolute bottom-2 w-full p-0.5"}>
          <div className="text-center text-white font-bold text-xl">
            <span className="shadow-md" style={{WebkitTextStroke: "1px", WebkitTextStrokeColor:"black"}}>{pointCard?.points}</span>
          </div>
          <div className="flex items-center justify-center">
              {pointCard?.gems.map((gem,index)=>{
                if(gem === "Y")
                  return <Image className="shadow-md" src={"/gems/yellow.svg"} alt={"yellow-gem"} width={16} height={16} key={index}/>
                else if(gem === "G")
                  return <Image className="shadow-md" src={"/gems/green.svg"} alt={"green-gem"} width={16} height={16} key={index}/>
                else if(gem === "B")
                  return <Image className="shadow-md" src={"/gems/blue.svg"} alt={"blue-gem"} width={16} height={16} key={index}/>
                else if(gem === "R")
                  return <Image className="shadow-md" src={"/gems/red.svg"} alt={"red-gem"} width={16} height={16} key={index}/>
              })}
          </div>
        </div>
      }

      {type==="trade"&&
        <div className={"absolute bottom-2 h-full px-2 py-4"}>
          <div className="flex flex-col items-center justify-start gap-0.5">
              {tradeCard?.from.map((gem,index)=>{
                if(gem === "Y")
                  return <Image className="shadow-md" src={"/gems/yellow.svg"} alt={"yellow-gem"} width={16} height={16} key={index}/>
                else if(gem === "G")
                  return <Image className="shadow-md" src={"/gems/green.svg"} alt={"green-gem"} width={16} height={16} key={index}/>
                else if(gem === "B")
                  return <Image className="shadow-md" src={"/gems/blue.svg"} alt={"blue-gem"} width={16} height={16} key={index}/>
                else if(gem === "R")
                  return <Image className="shadow-md" src={"/gems/red.svg"} alt={"red-gem"} width={16} height={16} key={index}/>
              })}
              {tradeCard?.from[0]&&<FaArrowDown size={20} className='text-white'/>}
              {tradeCard?.to.map((gem,index)=>{
                if(gem === "Y")
                  return <Image className="shadow-md" src={"/gems/yellow.svg"} alt={"yellow-gem"} width={16} height={16} key={index}/>
                else if(gem === "G")
                  return <Image className="shadow-md" src={"/gems/green.svg"} alt={"green-gem"} width={16} height={16} key={index}/>
                else if(gem === "B")
                  return <Image className="shadow-md" src={"/gems/blue.svg"} alt={"blue-gem"} width={16} height={16} key={index}/>
                else if(gem === "R")
                  return <Image className="shadow-md" src={"/gems/red.svg"} alt={"red-gem"} width={16} height={16} key={index}/>
              })}
          </div>
          <div className="absolute top-3 w-24 h-full flex items-center justify-center">
            {tradeCard?.extraGems.map((gem,index)=>{
              if(gem === "Y")
                return <Image className="shadow-xl" src={"/gems/yellow.svg"} alt={"yellow-gem"} width={32} height={32} key={index}/>
              else if(gem === "G")
                return <Image className="shadow-md" src={"/gems/green.svg"} alt={"green-gem"} width={32} height={32} key={index}/>
              else if(gem === "B")
                return <Image className="shadow-md" src={"/gems/blue.svg"} alt={"blue-gem"} width={32} height={32} key={index}/>
              else if(gem === "R")
                return <Image className="shadow-md" src={"/gems/red.svg"} alt={"red-gem"} width={32} height={32} key={index}/>
            })}
          </div>
        </div>
      }
      
    </div>
  )
}

export default Card