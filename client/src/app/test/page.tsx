"use client";
import { useState } from "react";
import { DragDropContext, Droppable,Draggable, type DropResult } from "@hello-pangea/dnd";

const Page = () => {
  const [array, setArray] = useState([1, 2, 3, 4, 5]);
  const [targetArray, setTargetArray] = useState<number[]>([]);
  const [playerPointCards, setPlayerPointCards] = useState([70]);

  const [openPointCards, setOpenPointCards] = useState([10,20,30,40,50,60]);
  const [openTradeCards, setOpenTradeCards] = useState([6,7,8,9,10,11,12])

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

  const onDragEnd = (result:DropResult)=>{
    const {destination, source, type} = result;
    console.log(type,source,destination);
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
      const cards = reorder(array,source.index,destination.index);
      setArray(cards);
    }
    else if(type==="card" && source.droppableId==="activeCards" && destination.droppableId==="usedCards"){
      setTargetArray(moveTo(array,targetArray,source.index,destination.index));
    }

    //moving a card from tradeCards to active cards
    if(type==="card"&& source.droppableId==="tradeCards" && destination.droppableId==="activeCards"){
      setArray(moveTo(openTradeCards,array,source.index,destination.index));
    }

    //move a card from points to player points
    if(type=="pointCard" && source.droppableId==="pointCards" && destination.droppableId==="pointSpace"){
      setPlayerPointCards(moveTo(openPointCards,playerPointCards,source.index,destination.index));
    } 

  }

  return (
    <div className="flex flex-col h-screen p-3">
      <DragDropContext  onDragEnd={onDragEnd}>
        <div className="grow flex">
          
            <Droppable droppableId="pointSpace" type="pointCard" direction={"vertical"}>
              {(provided)=>{
                return <div ref={provided.innerRef} className="bg-yellow-200 w-36 flex flex-col items-center">
                  {playerPointCards.map((card,index)=>{
                    return <Draggable isDragDisabled={true} draggableId={"playerPointCard"+index} key={index} index={index}>
                      {(provided)=>{
                        return <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="p-3"
                      >
                        <div
                        className="bg-bgGray rounded-md w-24 h-36 text-center"
                        >
                        {card}
                      </div>

                      </div>
                      }}
                    </Draggable>
                  })}
                </div>
              }}
            </Droppable>
          <div className="bg-green-100 grow flex flex-col px-10 justify-center">
            <div className="flex items-center">
              <Droppable droppableId="pointCards" type="pointCard" direction={"horizontal"}>
                {(provided)=>{
                  return <div
                  ref={provided.innerRef}
                  className="bg-red-100 grow flex justify-end p-2"
                  >
                    {openPointCards.map((item,index) => (
                      <Draggable draggableId={"pointCard"+index} index={index} key={index} >
                        {(provided)=>{
                          return <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="px-3"
                        >
                          <div
                          className="bg-bgGray rounded-md w-24 h-36 text-center"
                          >
                          {item}
                        </div>

                        </div>
                        }}
                      </Draggable>
                      
                    ))}
                    {provided.placeholder}
                  </div>
                }}
                
              </Droppable>
              <div className="bg-bgGray rounded-md w-24 h-36 text-center">
                Deck
              </div>
            </div>
            <div className="flex items-center">
              <Droppable droppableId="tradeCards" type="card" direction={"horizontal"}>
                {(provided)=>{
                  return <div
                  ref={provided.innerRef}
                  className="bg-teal-300 grow flex justify-end p-2"
                  >
                    {openTradeCards.map((item,index) => (
                      <Draggable draggableId={"tradeCards"+index} index={index} key={index} >
                        {(provided)=>{
                          return <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="px-3"
                        >
                          <div
                          className="bg-bgGray rounded-md w-24 h-36 text-center"
                          >
                          {item}
                        </div>

                        </div>
                        }}
                      </Draggable>
                      
                    ))}
                    {provided.placeholder}
                  </div>
                }}
              </Droppable>
              <div className="bg-bgGray rounded-md w-24 h-36 text-center">
                Deck
              </div>
            </div>
          </div>
          <div className="bg-slate-400 w-40">player cards area</div>
        </div>
        <div className="flex flex-col gap-3 items-center justify-center">
          <Droppable droppableId="usedCards" type="card" direction="horizontal">
            {(provided)=>{
              return <div 
              ref={provided.innerRef}
              className="bg-[#F0CDCD] w-9/12 rounded-md h-36 flex py-2">
                {targetArray.map((item,index) => (
                  <Draggable isDragDisabled={true} key={item} draggableId={"restSpace"+index} index={index}>
                    {(provided)=>{
                      return <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="px-3"
                      >
                        <div
                        className="bg-bgGray rounded-md w-20 h-32 text-center"
                        >
                        {item}
                      </div>

                      </div>
                      
                    }}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            }}
          </Droppable>
        

          <Droppable droppableId="activeCards" type="card" direction="horizontal">
            {(provided)=>{
              return <div 
              ref={provided.innerRef}
              className="bg-[#CDE8F0] w-11/12 rounded-md h-40 flex py-2 overflow-x-auto">
                {array.map((item,index) => (
                  <Draggable key={item} draggableId={"activeSpace"+index} index={index}>
                    {(provided)=>{
                      return <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="px-3"
                      >
                        <div
                        className="bg-bgGray rounded-md w-24 h-36 text-center"
                        >
                        {item}
                      </div>

                      </div>
                      
                      
                    }}
                  </Draggable>
                ))}
              </div>
            }}
          </Droppable>
        </div>
      

      
      
    </DragDropContext>
    </div>
  );
};

export default Page;
