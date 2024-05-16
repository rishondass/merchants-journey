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
import GemsUpgrade from "./GemsUpgrade";
import DiscardGemsModal from "./DiscardGemsModal";
type Props= {
  gameTimeInit: number;
  gameID: string;
}

const Game = ({gameTimeInit,gameID}:Props) => {
  const [user,setUser] = useUser(state=>[state.user,state.setUser]);
  const [game, setGame] = useState<IGame | null>();
  const [gameTime, setGameTime] = useState(gameTimeInit);
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);
  const [playerActiveCards, setPlayerActiveCards] = useState<ITradeCard[] | undefined>();
  const [playerRestCards, setPlayerRestCards] = useState<ITradeCard[] | undefined>([]);
  const [playerPointCards, setPlayerPointCards] = useState<IPointCard[] | undefined>([]);

  const [playerCoins, setPlayerCoins] = useState<{gold:number,silver:number} | undefined>({gold:0,silver:0})

  const [gems,setGems] = useState<string[] | undefined>([]);

  const [openPointCards, setOpenPointCards] = useState<IPointCard[] | undefined>([]);
  const [openTradeCards, setOpenTradeCards] = useState<ITradeCard[] | undefined>([]);

  const [gameBoardPoints, setGameBoardPoints] = useState<{gold:number,silver:number} | undefined>({gold:0,silver:0})

  const [gemsModal, setGemsModal] = useState(0);
  const [upgradeModal, setUpgradeModal] = useState(false);
  const [discardModal, setDiscardModal] = useState<{gems:string[],count:number} | null>(null);

  const [currentCard, setCurrentCard] = useState({source:-1, destination:-1});
  


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
      setPlayerCoins(player?.coins);
      setPlayerActiveCards(player?.activeCards);
      setPlayerRestCards(player?.restCards);
      setPlayerPointCards(player?.pointCards);
      setOpenPointCards(game.pointCards);
      setOpenTradeCards(game.tradeCards);
      setGameBoardPoints(game.coins);
    }
  },[game]);

  useEffect(()=>{
    console.log(playerCoins);
  },[playerCoins])



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

  const moveTradeToActive = (source:number,destination:number,gemsInit:string[])=>{
    if(openTradeCards && playerActiveCards){
      const tempTradeCards = [...openTradeCards];
      const [removed] = tempTradeCards?.splice(source,1);
      const tempActiveCards = [...playerActiveCards];
      tempActiveCards.splice(destination,0,removed);

      console.log(gemsInit);
      console.log(removed.extraGems);

    


      addGemsToPlayer(gemsInit,removed.extraGems);
      setPlayerActiveCards(tempActiveCards);
      setOpenTradeCards(tempTradeCards);
    }
    
  }


  const getGemsCount = (gems:string[])=>{
    const counter = {Y:0,G:0,B:0,R:0};
    
    gems.forEach(gem=>{
      if(gem==="Y"){
        counter.Y += 1;
      }
      else if(gem==="G"){
        counter.G += 1;
      }
      else if(gem==="B"){
        counter.B += 1;
      }
      else if(gem==="R"){
        counter.R += 1;
      }
    });

    return counter;
  }

  const removeGemsFromPlayer = (items:string[])=>{
    if(gems){
      const temp = [...gems];
      items.forEach(item=>{
        const index = temp.findIndex(rec=>{return rec===item});
        temp[index] = "";
      });
      return temp;
    }
    
  }

  const addGemsToPlayer = (prevGems:string[],items:string[])=>{
    const filteredGems = prevGems?.filter(gem=>{return gem !== ""});
    
    

    if(filteredGems&&(filteredGems.length + items.length) > 10){
      setDiscardModal({gems:[...filteredGems,...items],count:((filteredGems.length + items.length) - 10)});
      console.log("TOO MANY GEMS: " + (filteredGems.length + items.length));
    }else{
      if(gems){
        const temp = [...prevGems];
        const tempItems = [...items];
        temp.forEach((rec,i)=>{
          if(rec===""){
            temp[i] = tempItems.shift() ?? "";
          } 
        });
        console.log('adding gems', temp);
        setGems(temp);
      }
    }

    
  }

  

  const tradeGems = (from:string[],to:string[])=>{
    if(gems){
      const fromG = getGemsCount(from);
      const playerG = getGemsCount(gems);

      console.log(fromG, playerG);

      if(playerG.Y >= fromG.Y && playerG.G >= fromG.G && playerG.B >= fromG.B && playerG.R >= fromG.R){
        const tempGems = removeGemsFromPlayer(from);
        if(tempGems){
          addGemsToPlayer(tempGems,to);
          return true;
        }
          

      }else{
        return false;
      }


    }
    

  }

  const movePointsToPlayer = (source:number,destination:number)=>{
    if(openPointCards && playerPointCards){
      const tempPointCards = [...openPointCards];
      const [removed] = tempPointCards.splice(source,1);
      const tempPlayerPoints = [...playerPointCards];
      tempPlayerPoints.splice(destination,0,removed);

      setPlayerPointCards(tempPlayerPoints);
      setOpenPointCards(tempPointCards);
      if(source === 0 && gameBoardPoints && gameBoardPoints.gold > 0){
        setPlayerCoins((prev)=>{
          if(prev){
            return {gold: prev.gold+1, silver: prev.silver}
          }
        });
        setGameBoardPoints((prev)=>{
          if(prev){
            return {gold: prev.gold-1,silver:prev.silver}
          }
        })
      }
      else if(source === 0 && gameBoardPoints && gameBoardPoints.silver > 0 && gameBoardPoints.gold <= 0){
        setPlayerCoins((prev)=>{
          if(prev){
            return {gold: prev.gold, silver: prev.silver+1}
          }
        });
        setGameBoardPoints((prev)=>{
          if(prev){
            return {gold: prev.gold,silver:prev.silver-1}
          }
        })
      }
      else if(source === 1 && gameBoardPoints && gameBoardPoints.silver > 0){
        setPlayerCoins((prev)=>{
          if(prev){
            return {gold: prev.gold, silver: prev.silver+1}
          }
        });
        setGameBoardPoints((prev)=>{
          if(prev){
            return {gold: prev.gold,silver:prev.silver-1}
          }
        })
      }
    }
  }

  const closeGemsModal = ()=>{
    setGemsModal(0);
  };
  
  const toggleUpgradeModal = ()=>{
    setUpgradeModal(!upgradeModal);
  }

  const closeDiscardGemsModal = ()=>{
    setDiscardModal(null);
  }

  const tradeToActiveConfirm = (gemSel:boolean[],count:number)=>{
    if(gems && openTradeCards){
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



      
      setOpenTradeCards(temp);
      moveTradeToActive(currentCard.source,currentCard.destination,remainGems);
      setGemsModal(0);
      setCurrentCard({source:-1,destination:-1});
    }
    
  }

  const confirmUpgrade = (newGems: string[])=>{
    const temp = [...newGems];
    setGems(temp);
  }

  const confirmDiscard = (newGems: string[])=>{
    console.log('confirming discard');
    console.log(newGems);
    setGems(newGems);
  }

  const tradeToActive = (source: DraggableLocation,destination: DraggableLocation)=>{
    if(source.index===0 && gems){
      moveTradeToActive(source.index,destination.index,gems);
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


  const moveActiveToRest = (source:number,destination:number)=>{
    
    if(playerRestCards && playerActiveCards){
      
      const tempActiveCards = [...playerActiveCards];
      const [removed] = tempActiveCards?.splice(source,1);
      const tempRestCards = [...playerRestCards];
      tempRestCards.splice(destination,0,removed);

      setPlayerActiveCards(tempActiveCards);
      setPlayerRestCards(tempRestCards);
    }
  }
  
  
  const activeToRest = (source: DraggableLocation,destination: DraggableLocation)=>{
    
    if(playerActiveCards){
      const card = playerActiveCards[source.index];
    
      if(card.cardType === "Obtain"){
        addGemsToPlayer(gems ?? [],card.to);
        moveActiveToRest(source.index,destination.index);
      }
      else if(card.cardType === "Trade"){
        console.log('trade')
        if(tradeGems(card.from,card.to))
          moveActiveToRest(source.index,destination.index);
      }
      else if(card.cardType === "Upgrade"){
        toggleUpgradeModal();
        moveActiveToRest(source.index,destination.index);
      }
    }
    
  }

  const restToActive = ()=>{
    if(isPlayerTurn && playerActiveCards && playerRestCards){
      setPlayerActiveCards([...playerActiveCards, ...playerRestCards]);
      setPlayerRestCards([]);
    }
  }

  const onDragEnd = (result:DropResult)=>{
    const {destination, source, type} = result;
    if(!destination){
      return;
    }
    console.log(type,source,destination)
    //dropped in same position
    if(destination.droppableId === source.droppableId &&
      destination.index === source.index
    ){
      console.log('dropped in the same position');
      return;
    }

    //reordering cards in active slot
    if(type==="card" && source.droppableId === "activeCards" && destination.droppableId === source.droppableId){
      //FIXME: can't reorder cards
      // setPlayerActiveCards(reorder(playerActiveCards,source.index,destination.index));
    }
    
    //moving a card from active to rest
    if(type==="card" && source.droppableId==="activeCards" && destination.droppableId==="usedCards"){
      console.log('moving a card from active to rest');
      activeToRest(source,destination);
    }

    //moving a card from tradeCards to active cards
    if(type==="card"&& source.droppableId==="tradeCards" && destination.droppableId==="activeCards"){
      console.log('moving a card from tradeCards to active cards');
      tradeToActive(source,destination);
    }

    //move a card from points to player points
    if(type=="pointCard" && source.droppableId==="pointCards" && destination.droppableId==="pointSpace"){
      console.log('move a card from points to player points');
      if(gems && openPointCards){
        const p = getGemsCount(gems);
        const c = getGemsCount(openPointCards[source.index].gems);
        
        if(p.Y >= c.Y && p.B >= c.B && p.G >= c.G && p.R >= c.R){
          setGems(removeGemsFromPlayer(openPointCards[source.index].gems));
          movePointsToPlayer(source.index,destination.index);
        }
        
      }
      
      
    } 

  }

  return <>
    {discardModal&& createPortal(<DiscardGemsModal closeModal={closeDiscardGemsModal} gems={discardModal.gems} count={discardModal.count} confirmFn={confirmDiscard}/>,document.body)}
    {upgradeModal&& createPortal(<GemsUpgrade confirmFn={confirmUpgrade} count={2} gems={gems} closeModal={toggleUpgradeModal}/>,document.body)}
    {gemsModal>0&&createPortal(<GemsModal gems={gems} count={gemsModal} closeModal={closeGemsModal} confirmFn={tradeToActiveConfirm}/>,document.body)}
    <div className="flex flex-col h-screen p-3">
      <div className={"flex justify-center absolute w-96 z-10"} style={{right: "calc(50% - 194px)"}}>
        <div className="bg-blue-500 text-white w-24 py-3 rounded-full text-center shadow-lg">
          {Math.floor(gameTime/60)}:{(String(gameTime%60).padStart(2,"0"))}
        </div>
        <div className={clsx("text-white w-24 py-3 rounded-full text-center shadow-lg",isPlayerTurn?"bg-emerald-400":"bg-blue-500")}>
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
            <PointsCard openPointCards={openPointCards?.slice(0,6)}  gameBoardPoints={gameBoardPoints}/>
            <TradeCards openTradeCards={openTradeCards?.slice(0,7)}/>
          </div>
          <div className="bg-slate-400 w-60 flex flex-col gap-1">
            {playerActiveCards&&playerPointCards&&gems&&playerRestCards&&<PlayerCard activeCards={playerActiveCards} gems={gems} pointCards={playerPointCards} restCards={playerRestCards} username={user.username} id={user.userID} coins={playerCoins??{gold:0,silver:0}}/>}
            
            {game?.players.map(player=>{
              if(player.id !== user.userID)
                return <PlayerCard {...player}/>
            })}

          </div>
        </div>
        <div className="flex flex-col gap-3 items-center justify-center">
          <RestCards playerRestCards={playerRestCards} restToActive={restToActive}/>
          <ActiveCards playerActiveCards={playerActiveCards}/>

          
        </div>
      

      
      
    </DragDropContext>
    </div>
  </>
};

export default Game;
