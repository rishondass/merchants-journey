"use client"
import { useRouter } from "next/navigation";
import {useState, useEffect} from "react";
import { useUser } from "@/lib/globalStates";
import { getCookie } from "@/lib/Cookies";
import socket from "@/socket";
import Loading from "@/components/game/Loading";
import WaitingRoom from "@/components/game/WaitingRoom";
type Props = {
  params: { gameID: string } 
}

export default function Page({ params }: Props) {
  const [verify, setVerify] = useState(false);
  const router = useRouter();
  const [user,setUser] = useUser(state=>[state.user,state.setUser]);
  const [game, setGame] = useState<IGame>();

  useEffect(()=>{
    if(!socket.connected){
      
      getCookie('tok').then(cookie =>{
        socket.auth = {id: cookie?.value}
        socket.connect();
        console.log('reconnected');
      });
      
    }

    socket.once("authToken", (userID:string, username:string,gameID:string,token:string,expires:number) => {
      setUser({username:username,userID:userID,gameID:gameID});
      console.log('authing in game...');
    });
  },[]);

  useEffect(()=>{
    if(user.userID && user.gameID){
      console.log('verifying user...')
      socket.emit('getGameDetails',params.gameID,(gameObj:IGame|null)=>{
        if(gameObj){
          console.log(`PlayerID: ${user.userID}`)
          const player = gameObj.players.find(player=>{
            console.log(player.id)
            return player.id === user.userID});
          console.log(player);
          if(player){
            setGame(gameObj);
            setTimeout(()=>{
              setVerify(true);
            },1000)
          }else{
            router.replace('/unauthorized')
          }
          
        }
      })
    }
  },[user])




  
  return <>
    {verify?<WaitingRoom gameObj={game}/>:<Loading/>}
  </>
}