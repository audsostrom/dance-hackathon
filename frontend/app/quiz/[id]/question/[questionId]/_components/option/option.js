import './option.css';
import React from 'react';

export default function Option({ name, color }) {
  return (
    <>
      <div className='option-container' color={color}>
        <h2>{name}</h2>
      </div>
    </>
  );
}
