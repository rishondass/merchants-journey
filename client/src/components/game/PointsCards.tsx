import React from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import Card from "./Card";
import Image from "next/image";
import Coin from "./Coin";
type Props = {
  openPointCards: IPointCard[] | undefined;
  gameBoardPoints? : {gold:number,silver:number};
};
const PointsCards = ({ openPointCards, gameBoardPoints }: Props) => {
  return <div className="flex items-center">
      <Droppable
        droppableId="pointCards"
        type="pointCard"
        direction={"horizontal"}
      >
        {(provided) => {
          return (
            <div
              ref={provided.innerRef}
              className="bg-red-100 grow flex justify-end p-2 h-48 items-center"
            >
              {openPointCards?.map((item, index) => (
                <Draggable
                  draggableId={"pointCard" + index}
                  index={index}
                  key={item.cardID}
                >
                  {(provided) => {
                    return (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="px-3 relative"
                      > 
                        {gameBoardPoints&&gameBoardPoints.gold >0&&index===0&&<Coin coinNum={gameBoardPoints.gold} src="/coins/Gold.svg"/>}
                        {index===0&&gameBoardPoints&&gameBoardPoints.silver>0&&gameBoardPoints.gold<=0&&<Coin coinNum={gameBoardPoints.silver} src="/coins/Silver.svg"/>}
                        {index===1&&gameBoardPoints&&gameBoardPoints.silver>0&&gameBoardPoints.gold>0&&<Coin coinNum={gameBoardPoints.silver} src="/coins/Silver.svg"/>}
                        
                        <Card type="point" cardID={item.cardID} pointCard={item}/>
                      </div>
                    );
                  }}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          );
        }}
      </Droppable>
      <Image src={"/cards/point/back.svg"} width={110} height={154} alt={"point-card-back"} className="min-h-[154px]"/>
    </div>
};

export default PointsCards;
