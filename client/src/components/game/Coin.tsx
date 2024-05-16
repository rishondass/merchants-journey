import Image from "next/image";

type Props = {
  coinNum : number;
  src: string;
}

const Coin = ({coinNum, src}:Props) => {
  return (
    <div className='absolute z-10'>
        <div className="absolute top-1 right-1 pr-2 pt-1 text-white">x{coinNum}</div>
        <Image src={src} width={42} height={42} alt="coin"/>
    </div>
    
  )
}

export default Coin