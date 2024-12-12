import React from 'react';

const Greet = ({ name }) => {
  return (
    <header className='lg:text-2xl sm:text-lg text-slate-800'>
      Hey , <span className='font-[400] sm:text-lg text-2xl'>{name}</span>
    </header>
  );
};

export default Greet;
