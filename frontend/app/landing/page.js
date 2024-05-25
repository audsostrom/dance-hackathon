"use client"
import Link from 'next/link';
import './landing.css';

/**
 * @return {*} – Renders the Landing page
 */
const WEBCAM_ENDPOINT = "http://127.0.0.1:5000/video_feed"
const POSE_ENDPOINT = "http://127.0.0.1:5000/pose_feed"
// console.log({POSE_ENDPOINT})




export default async function Landing() {
	return (
      <div>
         landing page
         <Link href='/login'>
            <button>go to login</button>
         </Link>
      </div>
	);
}