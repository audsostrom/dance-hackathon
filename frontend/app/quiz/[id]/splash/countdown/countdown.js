'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import './countdown.css'

export const CountDown = ({duration, quizId}) => {
  const router = useRouter();
  const params = useParams();

  const [counter, setCounter] = React.useState(duration);

  React.useEffect(() => {
    counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
  }, [counter]);

  if(counter <= 0){
    router.push(`/quiz/${quizId}/question/0`) // temporary
  }


  return (
    <>
      <h3 className='countdown-container'>Countdown: {counter}</h3>
    </>
  );
};

