import Link from 'next/link';
import './landing.css';

/**
 * @return {*} – Renders the Landing page
 */
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