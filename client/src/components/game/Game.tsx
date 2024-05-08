"use client";
import { useState, useEffect} from "react";
import { createPortal } from 'react-dom';
import { DragDropContext, Droppable,Draggable, type DropResult, type DraggableLocation } from "@hello-pangea/dnd";
import socket from "@/socket";
import { useUser } from "@/lib/globalStates";
import clsx from "clsx";
import PointSpace from "@/components/game/PointSpace";
import PointsCard from "@/components/game/PointsCards";
import TradeCards from "./TradeCards";
import RestCards from "./RestCards";
import ActiveCards from "./ActiveCards";
import PlayerCard from "./PlayerCard";
import GemsModal from "./GemsModal";
type Props= {
  gameTimeInit: number;
  gameID: string;
}

const Game = ({gameTimeInit,gameID}:Props) => {
  const [user,setUser] = useUser(state=>[state.user,state.setUser]);
  const [game, setGame] = useState<IGame | null>();
  const [gameTime, setGameTime] = useState(gameTimeInit);
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);
  const [playerActiveCards, setPlayerActiveCards] = useState<ITradeCard[] | undefined>([]);
  const [playerRestCards, setPlayerRestCards] = useState<ITradeCard[] | undefined>([]);
  const [playerPointCards, setPlayerPointCards] = useState<IPointCard[] | undefined>([]);

  const [gems,setGems] = useState<string[] | undefined>([]);

  const [openPointCards, setOpenPointCards] = useState<IPointCard[] | undefined>([]);
  const [openTradeCards, setOpenTradeCards] = useState<ITradeCard[] | undefined>([]);

  const [gemsModal, setGemsModal] = useState(0);

  const [currentCard, setCurrentCard] = useState({source:-1, destination:-1})


  useEffect(()=>{
    socket.emit('getGame',gameID,(gameObj:IGame)=>{
      setGame(gameObj);
    });

    socket.on('updateGameTimer',(time:number)=>{
      if(Math.abs(time-gameTimeInit) <= gameTimeInit)
        setGameTime(time);
    })

    socket.on('updateGame',(gameObj: IGame)=>{
      console.log('game updated');
      setGame(gameObj);
    });



  },[]);

  useEffect(()=>{
    console.log(game);
    if(game){
      const player = game?.players.find(p=> p.id === user.userID);
      if(player){
        setIsPlayerTurn(game?.players[(game?.turn ??0)%(game?.maxPlayers ?? 2)].id === user.userID);
      }
      setGems(player?.gems);
      setPlayerActiveCards(player?.activeCards);
      setPlayerRestCards(player?.restCards);
      setPlayerPointCards(player?.pointCards);
      setOpenPointCards(game.pointCards?.slice(0,6));
      setOpenTradeCards(game.tradeCards);
    }
  },[game]);



  const endTurn = ()=>{
    socket.emit('endGameTurn',game);
  }

  const reorder = (list:any[],startIndex:number,endIndex:number)=>{
    const result = Array.from(list);
    const [removed] = result.splice(startIndex,1);
    result.splice(endIndex,0,removed);
    return result;
  }

  const moveTo = (sourceArray:any[], targetArray:any[],sourceIndex:number,endIndex:number)=>{
    const [removed] = sourceArray.splice(sourceIndex,1);
    const temp = targetArray;
    temp.splice(endIndex,0,removed);
    return temp;
  }

  const moveTradeToActive = (source:number,destination:number)=>{
    if(openTradeCards && playerActiveCards){
      const tempTradeCards = [...openTradeCards];
      const [removed] = tempTradeCards?.splice(source,1);
      const tempActiveCards = [...playerActiveCards];
      tempActiveCards.splice(destination,0,removed);

      setPlayerActiveCards(tempActiveCards);
      setOpenTradeCards(tempTradeCards);
    }
    
  }

  const closeGemsModal = ()=>{
    setGemsModal(0);
  }

  const tradeToActiveConfirm = (gemSel:boolean[],count:number)=>{
    if(gems){
      const remainGems:string[] = [];
      const removedGems:string[] = [];
      gemSel.forEach((gem,i)=>{
        if(gem){
          removedGems.push(gems[i]);
          remainGems.push("");
        }else{
          remainGems.push(gems[i]);
        }
      });
      // console.log(remainGems);
      // console.log(removedGems.length);

      let temp = [...openTradeCards];
      for(let i = 0; i < removedGems.length; i++){
        console.log(removedGems.length)
        temp?.[i].extraGems.push(removedGems[i]);
      }



      setGems(remainGems);
      setOpenTradeCards(temp);
      moveTradeToActive(currentCard.source,currentCard.destination);
      setGemsModal(0);
      setCurrentCard({source:-1,destination:-1});
    }
    
  }

  const tradeToActive = (source: DraggableLocation,destination: DraggableLocation)=>{
    if(source.index===0){
      moveTradeToActive(source.index,destination.index);
    }else{
        let count = 0;
        gems?.forEach(gem=>{
          if(gem){
            count++;
          }
        });
        if(count >= source.index){
          setGemsModal(source.index);
          setCurrentCard({source:source.index, destination:destination.index});
        }
    }
    
  }

  const onDragEnd = (result:DropResult)=>{
    const {destination, source, type} = result;
    
    if(!destination){
      return;
    }

    //dropped in same position
    if(destination.droppableId === source.droppableId &&
      destination.index === source.index
    ){
      return;
    }

    //moving a card from active to rest
    if(type==="card" && source.droppableId === "activeCards" && destination.droppableId === source.droppableId){
      setPlayerActiveCards(reorder(playerActiveCards,source.index,destination.index));
    }
    else if(type==="card" && source.droppableId==="activeCards" && destination.droppableId==="usedCards"){
      setPlayerRestCards(moveTo(playerActiveCards,playerRestCards,source.index,destination.index));
    }

    //moving a card from tradeCards to active cards
    if(type==="card"&& source.droppableId==="tradeCards" && destination.droppableId==="activeCards"){
      tradeToActive(source,destination);
    }

    //move a card from points to player points
    if(type=="pointCard" && source.droppableId==="pointCards" && destination.droppableId==="pointSpace"){
      setPlayerPointCards(moveTo(openPointCards,playerPointCards,source.index,destination.index));
    } 

  }

  return <>
    {gemsModal>0&&createPortal(<GemsModal gems={gems} count={gemsModal} closeModal={closeGemsModal} confirmFn={tradeToActiveConfirm}/>,document.body)}
    <div className="flex flex-col h-screen p-3">
      <div className={"flex justify-center"}>
        <div className="bg-blue-500 text-white w-24 py-3 rounded-full text-center">
          {Math.floor(gameTime/60)}:{(String(gameTime%60).padStart(2,"0"))}
        </div>
        <div className={clsx("text-white w-24 py-3 rounded-full text-center",isPlayerTurn?"bg-emerald-400":"bg-blue-500")}>
          Turn: {game?.players[(game?.turn ??0)%(game?.maxPlayers ?? 2)].username}
        </div>
        <div>
          <button onClick={endTurn} className="p-3 bg-red-400 text-white">End Turn</button>
        </div>
      </div>
      <DragDropContext  onDragEnd={onDragEnd}>
        <div className="grow flex">
          
          <PointSpace playerPointCards={playerPointCards}/>
          <div className="bg-green-100 grow flex flex-col px-10 justify-center">
            <PointsCard openPointCards={openPointCards}/>
            <TradeCards openTradeCards={openTradeCards?.slice(0,7)}/>
          </div>
          <div className="bg-slate-400 w-60">
            {playerActiveCards&&playerPointCards&&gems&&playerRestCards&&<PlayerCard activeCards={playerActiveCards} gems={gems} pointCards={playerPointCards} restCards={playerRestCards} username={user.username} id={user.userID} coins={{copper:0,silver:0}}/>}
            
            {game?.players.map(player=>{
              if(player.id !== user.userID)
                return <PlayerCard {...player}/>
            })}

          </div>
        </div>
        <div className="flex flex-col gap-3 items-center justify-center">
          <RestCards playerRestCards={playerRestCards}/>
          <ActiveCards playerActiveCards={playerActiveCards}/>

          
        </div>
      

      
      
    </DragDropContext>
    </div>
  </>
};

export default Game;
