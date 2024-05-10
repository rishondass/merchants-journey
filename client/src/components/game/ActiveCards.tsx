import React from 'react'
import { Droppable, Draggable } from '@hello-pangea/dnd';
import Card from './Card';

type Props = {
  playerActiveCards:ITradeCard[] | undefined
}
const ActiveCards = ({playerActiveCards}:Props) => {
  return (
    <Droppable droppableId="activeCards" type="card" direction="horizontal">
            {(provided)=>{
              return <div 
              ref={provided.innerRef}
              className="bg-[#CDE8F0] w-11/12 rounded-md h-40 flex py-2 overflow-x-auto">
                {playerActiveCards?.map((item,index) => (
                  <Draggable key={item.cardID} draggableId={"activeSpace"+index} index={index}>
                    {(provided)=>{
                      return <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="px-3"
                      >
                        <Card type="trade" tradeCard={item} cardID={item.cardID}/>

                      </div>
                      
                      
                    }}
                  </Draggable>
                ))}
              </div>
            }}
          </Droppable>
  )
}

export default ActiveCards