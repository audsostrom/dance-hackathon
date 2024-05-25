"use client"
import Link from 'next/link';
import './landing.css';
import React, { useEffect, useState } from 'react';

/**
 * @return {*} – Renders the Landing page
 */
const WEBCAM_ENDPOINT = "http://127.0.0.1:5000/video_feed"
const POSE_ENDPOINT = "http://127.0.0.1:5000/pose_feed"
// console.log({POSE_ENDPOINT})




const StreamComponent = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchStream = async () => {
      const response = await fetch(POSE_ENDPOINT);
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        setMessages(prevMessages => [...prevMessages, chunk]);
      }
    };

    fetchStream().catch(console.error);
  }, []);

  return (
    <div>
      <h1>Streaming Data</h1>
      <div id="stream-container">
         {messages[messages.length - 1]}
        {/* {messages.map((message, index) => (
          <p key={index}>{message}</p>
        ))} */}
      </div>
    </div>
  );
};

export default async function Landing() {
	return (
      <div>
         landing page
         <Link href='/login'>
            <button>go to login</button>
         </Link>
         <img src={WEBCAM_ENDPOINT} alt="webcam" />
         <StreamComponent />
      </div>
	);
}