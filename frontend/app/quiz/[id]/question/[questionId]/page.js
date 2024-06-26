import { getQuiz } from '@/app/db';
import './quiz.css';
import { StreamComponent } from './stream/stream';
import { redirect } from 'next/navigation';
import Option from './_components/option/option';
import { createUserQuiz } from '@/app/db';
import { auth } from '../../../../auth';

const WEBCAM_ENDPOINT = 'http://127.0.0.1:5000/video_feed';
export default async function Quiz({ params: { id, questionId } }) {
  const session = await auth();
  console.log(session?.user);
  const response = await getQuiz(id);
  console.log('params', id, questionId)

  if (questionId == 0 && session?.user?.email) {
    console.log('fudge')
    await createUserQuiz(session?.user?.email, id)
  }
  const danceOptions = {
    dab: 0,
    whip: 1,
    squidward: 2,
    'come up with fourth move': 3,
  };

  const colors = {
    0: 'red',
    1: 'blue',
    2: 'green',
    3: 'yellow',
  };

  return (
    <div>
      <StreamComponent status={"quiz"} numLastQuestionId={response.questions.length -1}/>
      <div className='question-container'>
        <h1>{response.questions[questionId].question}</h1>
        {/** print out options */}
        <div className='options-container'>
          {response.questions[questionId].options.map((option, index) => (
            <Option key={index} name={option} color={colors[index]} />
          ))}
        </div>
        <div className='footer'>
          <h3 className='footer-h3'>hit the emote for the correct answer!</h3>
        </div>

        <div className='stream-container'>
          <div className='stream-label'>you</div>
          <img src={WEBCAM_ENDPOINT} alt='webcam' />
        </div>
      </div>
    </div>
  );
}
