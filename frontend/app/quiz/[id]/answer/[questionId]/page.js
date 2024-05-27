import { getQuiz } from '@/app/db';
import './answer.css'
import { auth } from '../../../../auth';
import { StreamComponent } from '../../question/[questionId]/stream/stream';
import { getUserResponse } from '@/app/db';
import Link from 'next/link';
const WEBCAM_ENDPOINT = 'http://127.0.0.1:5000/video_feed';

export default async function Answer({ params: {id, questionId}, searchParams: {answer} } ) {

  const session = await auth();

  let userResponse;
  const response = await getQuiz(id);
  if (session?.user?.email) {
    userResponse = await getUserResponse(session?.user?.email, id, questionId, response.questions[questionId].answer == answer)
  } else {
    redirect(redirect('/'))
  }
  console.log('userResponse', userResponse, userResponse.responses[questionId])

  return (
    <div>
            <StreamComponent status={"answer"} numLastQuestionId={response.questions.length - 1}/>
      <div className='answer-container'>
        <div className='answer-header'>
          <h3>{response.questions[questionId].question}</h3>
        </div>
        <div className='answer-body'>
          {response.questions[questionId].answer == answer ? 
          <h1 className='answer-correct'>correct!</h1> :
          <h1 className='answer-incorrect'>incorrect :(</h1>
          }
          {userResponse && userResponse?.responses && <div>You got this {userResponse.responses[questionId] ? 'right' : 'wrong'} last time</div>}
          {
          (Number(questionId) < response.questions.length - 1) &&         
          
          <Link href={`/quiz/${response._id.toString()}/question/${Number(questionId) + 1}`}>
            <button>next question</button>
          </Link>

        }
                {
          (Number(questionId) >= response.questions.length - 1) &&         
          
          <Link href={`/quiz/${id}/result`}>
            <button>you're done</button>
          </Link>

        }
          <div className='stream-container'>
            <div className='stream-label'>you</div>
            <img src={WEBCAM_ENDPOINT} alt='webcam' />
          </div>
        </div>
      </div>
    </div>
  );
}
