import React from 'react'

interface GreetProps {
    name : string
}

const Greet:React.FC<GreetProps> = ({name}) => {
  return (
    <header className='  lg:text-2xl sm:text-lg text-slate-800 '>
        Hey , <span className='font-[400] sm:text-lg text-2xl'>{name}</span>
    </header>
  )
}

export default Greet