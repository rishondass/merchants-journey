import {useState} from 'react'
import socket from "@/socket";
import { removeCookie,getCookie, getCookieAll, setCookie } from "@/lib/Cookies";
import {useRouter} from "next/navigation";
import {useUser} from "@/lib/globalStates";
type props = {
  toggleModal : ()=>void;
}

const CreateModal = ({toggleModal}:props) => {
  const [user,setUser] = useUser(state=>[state.user,state.setUser])
  const [game, setGame] = useState({players:2,time:600})
  const router = useRouter();

  const createGame = ()=>{
    socket.emit('createGame',game,(gameID:string)=>{
      setUser({...user,gameID:gameID});
      router.push('/game/'+gameID);
    });
    toggleModal();
  }

  return (
    <div className="bg-black/35 w-full h-full absolute top-0 right-0 z-10 flex justify-center items-center" onClick={toggleModal}>
      <div className="bg-white w-80 rounded-md p-2 " onClick={e=>{e.stopPropagation();}}>
        <div className="text-center text-lg font-bold">New Room</div>
        <div className="flex items-center gap-3 pt-3">
          <label className='w-20'>Players:</label>
          <select className={'border-2 p-2 rounded-md w-full'} onChange={e=>{setGame({...game,players:parseInt(e.target.value)})}}>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </select>
        </div>
        <div className="flex items-center gap-3 pt-2">
          <label className='w-20'>Speed:</label>
          <select defaultValue={600} className={'border-2 p-2 rounded-md w-full'} onChange={e=>{setGame({...game,time:parseInt(e.target.value)})}}>
            <option value={300}>Quick (5min)</option>
            <option value={600}>Regular (10min)</option>
            <option value={1200}>Long (20min)</option>
          </select>
        </div>
        <div className="text-center pt-2">
          <button className="bg-emerald-400 text-white px-4 py-2 rounded-md" onClick={createGame}>
            continue
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateModal