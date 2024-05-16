import React from 'react'
import { Droppable, Draggable } from '@hello-pangea/dnd';
import Card from './Card';
import Image from "next/image";
type Props = {
  openTradeCards:ITradeCard[] | undefined
}

const TradeCards = ({openTradeCards}:Props) => {
  return (
    <div className="flex items-center">
              <Droppable droppableId="tradeCards" type="card" direction={"horizontal"}>
                {(provided)=>{
                  return <div
                  ref={provided.innerRef}
                  className="bg-teal-300 grow flex justify-end p-2 h-48 items-center"
                  >
                    {openTradeCards?.map((item,index) => (
                      <Draggable draggableId={"tradeCards"+index} index={index} key={item.cardID} >
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
              <Image src={"/cards/trade/back.svg"} width={110} height={154} alt={"point-card-back"} priority={true}/>
            </div>
  )
}

export default TradeCards