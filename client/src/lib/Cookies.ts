'use server';
import { cookies } from 'next/headers';

export const setCookie = async(key:string, value:string, exp?:number)=>{
  cookies().set({
    name: key,
    value: value,
    expires: exp,
    httpOnly: true,
  });
}

export const getCookie = async(key:string)=>{
  const item = cookies().get(key);
  return item;
};

export const getCookieAll = async()=>{
  return cookies().getAll();
}

export const removeCookie = async(key:string)=>{
  cookies().delete(key);
}