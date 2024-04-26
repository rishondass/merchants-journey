import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server';
import { redirect } from 'next/navigation';
import socket from "@/socket";

export function middleware(request: NextRequest) {

  if(request.nextUrl.pathname === "/"){
    const token = request.cookies.get('tok');
    if(token){
      return NextResponse.redirect(new URL('/lobby', request.url));
    }
  }

  if(request.nextUrl.pathname === "/lobby"){
    const token = request.cookies.get('tok');
    if(!token){
      return NextResponse.redirect(new URL('/', request.url));
    }

  }

  
  
}