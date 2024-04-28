import { create } from 'zustand'

type useUsername = {
  user: {
    username: string,
    userID: string,
    gameID?: string,
  };
  setUser: (user:{username:string,userID:string,gameID?:string})=>void;
}



export const useUser = create<useUsername>((set) => ({
  user: {username:"",userID:""},
  setUser: (user) => set({user: user}),
}))