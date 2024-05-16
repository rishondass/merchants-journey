import React from 'react'
import { Droppable, Draggable } from '@hello-pangea/dnd';
import Card from './Card';
import { FaBed } from "react-icons/fa";

type Props = {
  playerRestCards:ITradeCard[] | undefined,
  restToActive: ()=> void,
}

const RestCards = ({playerRestCards,restToActive}:Props) => {
  return (
    <Droppable droppableId="usedCards" type="card" direction="horizontal">
            {(provided)=>{
              return <div className="w-9/12 flex items-center"><div 
              ref={provided.innerRef}
              className="bg-[#F0CDCD] rounded-md h-48 items-center flex py-2 grow pr-10">
                {playerRestCards?.map((item,index) => (
                  <Draggable isDragDisabled={true} key={index} draggableId={"restSpace"+index} index={index}>
                    {(provided)=>{
                      return <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="px-3"
                      >
                        <Card type="trade" cardID={item.cardID} tradeCard={item}/>

                      </div>
                      
                    }}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
                <button className="bg-blue-500 p-4 text-center text-white rounded-md h-20" onClick={restToActive}>
                  <FaBed size={20}/>
                  Rest
                </button>
              
              </div>
            }}
          </Droppable>
  )
}

export default RestCards