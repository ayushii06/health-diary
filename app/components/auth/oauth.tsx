"use client"
import React from 'react'
import Image from 'next/image'
import google from '../../../public/google.svg'
import { signIn } from "next-auth/react"

function OAuth() {
  return (
     <div className="w-full flex  gap-4">
                            <button type='button' className="cursor-pointer items-center justify-center whitespace-nowrap rounded-md font-medium outline-none  border border-input h-10 px-4 py-2 flex w-full gap-2" onClick={()=>{
                                signIn('google', { callbackUrl: '/' })}}>
                               <Image src={google} alt="google-logo"/>
                                <span>Google</span>
                            </button>
                           
                        </div>
  )
}

export default OAuth