'use server';
import { cookies } from 'next/headers';

export const setCookie = (key:string, value:string, exp?:number)=>{
  cookies().set({
    name: key,
    value: value,
    expires: exp,
    httpOnly: true,
  });
}

export const getCookie = (key:string)=>{
  return cookies().get(key);
};

export const getCookieAll = ()=>{
  return cookies().getAll();
}

export const removeCookie = (key:string)=>{
  cookies().delete(key);
}