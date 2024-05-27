'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';


const WEBCAM_ENDPOINT = "http://127.0.0.1:5000/video_feed"
const POSE_ENDPOINT = "http://127.0.0.1:5000/pose_feed"
// console.log({POSE_ENDPOINT})


export const StreamComponent = ({status, numLastQuestionId}) => {
  const [messages, setMessages] = useState([]);
  const router = useRouter();
  const params = useParams();

  const danceOptions = {
    'dab': 0,
    'whip': 1,
    'squidward': 2,
    'come up with fourth move': 3
  }


  useEffect(() => {
    const fetchStream = async () => {
      const response = await fetch(POSE_ENDPOINT);
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        if (messages.slice(Math.max(messages.length - 5, 0)).every(val => val === messages[messages.length - 1] && val != 'idle') && messages && messages.length > 0) {
          console.log('heyah')
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        setMessages(prevMessages => [...prevMessages, chunk]);
      }
    };

    fetchStream().catch(console.error);
  }, []);

  setTimeout(() => {
    if (messages.slice(Math.max(messages.length - 5, 0)).every(val => val === messages[messages.length - 1] && val != 'idle') && messages && messages.length > 0) {
      console.log('yippee', messages[messages.length - 1])
      // redirect based on response
      if (status == "quiz"){
        router.push(`/quiz/${params['id']}/answer/${params['questionId']}/?answer=${danceOptions[messages[messages.length - 1]]}`) // temporary
      } else if (status == "answer" && params['questionId'] != numLastQuestionId){
        console.log("Test", params['questionId'], numLastQuestionId)
        router.push(`/quiz/${params['id']}/question/${Number(params['questionId']) + 1}/`)
      } else if (status == "answer" && Number(params['questionId']) == numLastQuestionId){
        console.log("bruh")
        router.push(`/quiz/${params['id']}/result/`)
      }
    }
  }, 2000);

  return (
    <>
    </>
    // <div>
    //   <h1>Streaming Data</h1>
    //   <div id="stream-container">
    //      {messages[messages.length - 1]}
    //     {/* {messages.map((message, index) => (
    //       <p key={index}>{message}</p>
    //     ))} */}
    //   </div>
    // </div>
  );
};

