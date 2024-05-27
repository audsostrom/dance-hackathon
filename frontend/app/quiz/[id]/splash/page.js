import { getQuiz } from '@/app/db';
import './splash.css';
import { CountDown } from './countdown/countdown';
// import { StreamComponent } from '../question/[questionId]/stream/stream';

const WEBCAM_ENDPOINT = 'http://127.0.0.1:5000/video_feed';
export default async function Splash({ params: { id, questionId } }) {
  const response = await getQuiz(id);

  return (
    <div>
      <div className='splash-container'>
        <h1>Starting Quiz: {response.title}</h1>
        <div className='footer'>
          <CountDown duration={5} quizId={id}/>
        </div>

        <div className='splash-stream-container'>
          <h1>you!</h1>
          <img width={640} height={360} src={WEBCAM_ENDPOINT} alt='webcam' />
        </div>
      </div>
    </div>
  );
}
