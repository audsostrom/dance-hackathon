import Link from 'next/link';
import './landing.css';

/**
 * @return {*} – Renders the Landing page
 */

export default function Landing() {
  return (
    <div className='landing-container'>
      <h1>DanceBrains!</h1>
      <div className='hero-container'>
        <Link className='login-btn' href='/login'>
          Login to start!
        </Link>
      </div>
    </div>
  );
}
