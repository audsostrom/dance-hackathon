import { getQuiz } from '@/app/db';
import './results.css'
import { auth } from '../../../auth';
import { getLastUserResponse } from '@/app/db';
import Link from 'next/link';
const WEBCAM_ENDPOINT = 'http://127.0.0.1:5000/video_feed';

export default async function Answer({ params: {id, questionId}, searchParams: {answer} } ) {

  const session = await auth();

  let userResponse;
  if (session?.user?.email) {
    userResponse = await getLastUserResponse(session?.user?.email, id)
  } else {
    redirect(redirect('/'))
  }
  console.log('userResponse', userResponse, userResponse.responses[questionId])

  return (
      <div className='results-container'>
        <div className='answer-header'>
          <h1 className='done'>all done!</h1>
        </div>
        <h2 class='subtitle'>
          You got a {userResponse.responses.filter(Boolean).length} out of {userResponse.responses.length}!
        </h2>
        <div className='answer-body'>
          <div className='stream-container'>
            <img className='you' src={WEBCAM_ENDPOINT} alt='webcam' />
          </div>
        </div>
        <Link className='link-button' href='/home'>
          <button>go back to home</button>
        </Link>
      </div>
  );
}
