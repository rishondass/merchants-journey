"use client";
import clsx from "clsx";
import {useState, useEffect} from "react";
import Image from "next/image";

type Props = {
  gemsInit: string[] | undefined,
  count: number
}

const page = ({gemsInit,count}:Props) => {
  const [gems, setGems] = useState(gemsInit);
  const [counter,setCounter] = useState(count)
  const [gemSel, setGemSel] = useState([false,false,false,false,false,false,false,false,false,false]);


  useEffect(()=>{
    console.log(gemSel);
  },[gemSel])

  const selectGems = (index:number)=>{
    if(counter > 0 || gemSel[index])
      setGemSel((prev)=>{
        const temp = [...prev];
        temp[index] = !temp[index];
        if(temp[index])
          setCounter(counter-1);
        else
          setCounter(counter+1);
        return temp;
      });
    
  }

  return (
    <div className="bg-black/40 h-screen pt-20">
      <div className="bg-slate-900 w-96 h-60 mx-auto text-white rounded-md p-2">
        <div className="text-xl text-center font-semibold pb-3">
          Select Gems: <span>{counter}</span>
        </div>
        <div className="grid grid-cols-5 gap-3">
          {gems?.map((gem,index)=>{
            if(gem === "Y")
              return <Image className={clsx("cursor-pointer",gemSel[index]?"drop-shadow-whiteBr":"drop-shadow-md")} src={"/gems/yellow.svg"} alt={"yellow-gem"} width={52} height={52} onClick={()=>{selectGems(index)}}/>
            else if(gem === "G")
              return <Image className={clsx("cursor-pointer",gemSel[index]?"drop-shadow-whiteBr":"drop-shadow-md")} src={"/gems/green.svg"} alt={"green-gem"} width={52} height={52} onClick={()=>{selectGems(index)}}/>
            else if(gem === "B")
              return <Image className={clsx("cursor-pointer",gemSel[index]?"drop-shadow-whiteBr":"drop-shadow-md")} src={"/gems/blue.svg"} alt={"blue-gem"} width={52} height={52} onClick={()=>{selectGems(index)}}/>
            else if(gem === "R")
              return <Image className={clsx("cursor-pointer",gemSel[index]?"drop-shadow-whiteBr":"drop-shadow-md")} src={"/gems/red.svg"} alt={"red-gem"} width={52} height={52} onClick={()=>{selectGems(index)}}/>
            else 
              return <Image className="shadow-inner" src={"/gems/blankgem.png"} alt={"blank-gem"} width={52} height={52}/>
          })}
        </div>
        <div className="flex justify-center pt-3">
          {counter===0&&
          <button className="text-white bg-emerald-500 px-3 py-2 rounded-md">
            confirm
          </button>
          }
          
        </div>
      </div>
    </div>
  )
}

export default page