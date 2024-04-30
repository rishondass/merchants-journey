"use client";
import {useRouter} from "next/navigation";
const page = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen">
      <div className="text-4xl font-bold text-red-500 pb-10">NOT AUTHORIZED</div>
      <button className="bg-emerald-400 px-5 py-3 text-white rounded-md" onClick={()=>{router.replace("/lobby");}}>lobby</button>
    </div>
  )
}

export default page