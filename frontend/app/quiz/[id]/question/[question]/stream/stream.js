'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';


const WEBCAM_ENDPOINT = "http://127.0.0.1:5000/video_feed"
const POSE_ENDPOINT = "http://127.0.0.1:5000/pose_feed"
// console.log({POSE_ENDPOINT})


export const StreamComponent = () => {
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

  if (messages.slice(Math.max(messages.length - 5, 0)).every(val => val === messages[messages.length - 1] && val != 'idle') && messages && messages.length > 0) {
    console.log('yippee', messages[messages.length - 1])
    // i hard coded the response, but it would be whatever number we assign the emote
    router.push(`/answer/${params['id']}/question/${params['question']}/${danceOptions[messages[messages.length - 1]]}`) // temporary
  }

  return (
    <div>
      <h1>Streaming Data</h1>
      <div id="stream-container">
         {messages[messages.length - 1]}
        {/* {messages.map((message, index) => (
          <p key={index}>{message}</p>
        ))} */}
      </div>
      {messages.slice(Math.max(messages.length - 5, 0)).map((message, index) => (
          <p key={index}>{message}</p>
      ))}

      {messages.slice(Math.max(messages.length - 5, 0)).every(val => val === messages[0] && val != 'idle') && <div>you've done a lot of dabs</div>}
    </div>
  );
};

