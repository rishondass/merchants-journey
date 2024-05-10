import React from 'react'
import { Droppable, Draggable } from '@hello-pangea/dnd';
import Card from './Card';

type Props = {
  playerRestCards:ITradeCard[] | undefined
}

const RestCards = ({playerRestCards}:Props) => {
  return (
    <Droppable droppableId="usedCards" type="card" direction="horizontal">
            {(provided)=>{
              return <div 
              ref={provided.innerRef}
              className="bg-[#F0CDCD] w-9/12 rounded-md h-36 flex py-2">
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
            }}
          </Droppable>
  )
}

export default RestCards