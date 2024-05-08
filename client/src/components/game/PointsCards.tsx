import React from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import Card from "./Card";
import Image from "next/image";
type Props = {
  openPointCards: IPointCard[] | undefined;
};
const PointsCards = ({ openPointCards }: Props) => {
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
              className="bg-red-100 grow flex justify-end p-2"
            >
              {openPointCards?.map((item, index) => (
                <Draggable
                  draggableId={"pointCard" + index}
                  index={index}
                  key={index}
                >
                  {(provided) => {
                    return (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="px-3"
                      >
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
