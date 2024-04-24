"use client";
import { useEffect, useState } from "react";
import socket from "@/socket";



const page = () => {
	const [username, setUserName] = useState("");

	useEffect(()=>{
		socket.on("connect", ()=>{
			console.log("Connected");
		});

		return () => {
			socket.close();
		};
		
	},[])
	
	const onUserNameSelection =()=>{
		socket.auth = {username}
		socket.connect();
	}

	return <div>
		<input type="text" className="border-2 p-4 text-black" placeholder="gamertag" onChange={(e)=>{setUserName(e.target.value)}} />
		<button className="bg-emerald-400 p-4 text-black" onClick={onUserNameSelection}>Join</button>
	</div>;
};

export default page;
