import React from 'react'
import { Droppable, Draggable } from '@hello-pangea/dnd'
import Card from './Card'

type Props = {
  playerPointCards:IPointCard[] | undefined
}

const PointSpace = ({playerPointCards}:Props) => {
  return (
    <Droppable droppableId="pointSpace" type="pointCard" direction={"vertical"}>
      {(provided)=>{
        return <div ref={provided.innerRef} className="bg-yellow-200 w-36 flex flex-col items-center overflow-y-auto ">
          {playerPointCards?.map((item,index)=>{
            return <Draggable draggableId='pointSpace' index={index} key={index}>
              {(provided)=>{
                return <div
                ref={provided.innerRef} 
                {...provided.dragHandleProps}
                {...provided.draggableProps}
                >
                  <Card type='point' cardID={item.cardID} pointCard={item}/>
                </div>
              }}
            </Draggable>
          })}

        </div>
      }}
    </Droppable>
  )
}

export default PointSpace