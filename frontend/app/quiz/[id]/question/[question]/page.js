import { getQuiz } from '@/app/db';
import './quiz.css';
import { StreamComponent } from './stream/stream';
import { redirect } from 'next/navigation';
import Option from './_components/option/option';

const WEBCAM_ENDPOINT = 'http://127.0.0.1:5000/video_feed';
export default async function Quiz({ params: { id, question } }) {
  const response = await getQuiz(id);
  console.log('hi', response);
  console.log('params', question);

  console.log('test', response.questions[question].question);

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
      <StreamComponent />
      <div className='question-container'>
        <h1>{response.questions[question].question}</h1>
        {/** print out options */}
        <div className='options-container'>
          {response.questions[question].options.map((option, index) => (
            <Option key={index} name={option} color={colors[index]} />
          ))}
        </div>
        <div className='footer'>
          <h3>hit the emote for the correct answer!</h3>
        </div>

        <div className='stream-container'>
          <h1>YOUR MOM</h1>
          <img src={WEBCAM_ENDPOINT} alt='webcam' />
        </div>
      </div>
    </div>
  );
}
