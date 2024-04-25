import React from 'react'
import { FaUserAlt } from "react-icons/fa";
import clsx from 'clsx';
type Props = {
  name: string,
  isHost?: boolean,
}

const PlayerCard = ({name,isHost}:Props) => {
  return (
    <div className="flex items-center gap-1 py-1 px-3">
      <FaUserAlt className={clsx(isHost&&"text-red-400")}/>
      <div className={clsx("w-16 overflow-hidden text-nowrap flex items-center justify-center",isHost&&"text-red-400")}>{name}</div>
    </div>
  )
}

export default PlayerCard