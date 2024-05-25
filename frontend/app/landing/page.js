import Link from 'next/link';
import './landing.css';

/**
 * @return {*} – Renders the Landing page
 */
const WEBCAM_ENDPOINT = "http://127.0.0.1:5000/video_feed"

export default async function Landing() {
	return (
      <div>
         landing page
         <Link href='/login'>
            <button>go to login</button>
         </Link>
         <img src={WEBCAM_ENDPOINT} alt="webcam" />
      </div>
	);
}