
import clsx from "clsx";
import {useState, useEffect} from "react";
import Image from "next/image";
import { IoIosClose } from "react-icons/io";

type Props = {
  gems: string[] | undefined,
  count: number,
  closeModal: ()=>void,
  confirmFn: (gems:boolean[],count:number)=>void,
}




const GemsModal = ({gems,count,closeModal,confirmFn}:Props) => {
  const [counter,setCounter] = useState(count)
  const [gemSel, setGemSel] = useState([false,false,false,false,false,false,false,false,false,false]);


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
    <div className="bg-black/70 h-screen w-screen pt-20 absolute top-0 right-0 z-10">
      <div className="bg-slate-900 w-96 h-64 mx-auto text-white rounded-md p-2">
        <div className="flex justify-end">
          <IoIosClose size={24} onClick={closeModal} className="cursor-pointer"/>
        </div>
        <div className="text-xl text-center font-semibold pb-3">
          Select Gems: <span>{counter}</span>
        </div>
        <div className="grid grid-cols-5 gap-3">
          {gems?.map((gem,index)=>{
            if(gem === "Y")
              return <Image className={clsx("cursor-pointer",gemSel[index]?"drop-shadow-whiteBr":"drop-shadow-md")} src={"/gems/yellow.svg"} alt={"yellow-gem"} width={52} height={52} onClick={()=>{selectGems(index)}} key={index}/>
            else if(gem === "G")
              return <Image className={clsx("cursor-pointer",gemSel[index]?"drop-shadow-whiteBr":"drop-shadow-md")} src={"/gems/green.svg"} alt={"green-gem"} width={52} height={52} onClick={()=>{selectGems(index)}} key={index}/>
            else if(gem === "B")
              return <Image className={clsx("cursor-pointer",gemSel[index]?"drop-shadow-whiteBr":"drop-shadow-md")} src={"/gems/blue.svg"} alt={"blue-gem"} width={52} height={52} onClick={()=>{selectGems(index)}} key={index}/>
            else if(gem === "R")
              return <Image className={clsx("cursor-pointer",gemSel[index]?"drop-shadow-whiteBr":"drop-shadow-md")} src={"/gems/red.svg"} alt={"red-gem"} width={52} height={52} onClick={()=>{selectGems(index)}} key={index}/>
            else 
              return <Image className="shadow-inner" src={"/gems/blankgem.png"} alt={"blank-gem"} width={52} height={52} key={index}/>
          })}
        </div>
        <div className="flex justify-center pt-3">
          {counter===0&&
          <button className="text-white bg-emerald-500 px-3 py-2 rounded-md" onClick={()=>{confirmFn(gemSel,counter)}}>
            confirm
          </button>
          }
          
        </div>
      </div>
    </div>
  )
}

export default GemsModal