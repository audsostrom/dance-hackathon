import { getQuiz } from '@/app/db';
import './answer.css';
import { StreamComponent } from '../../question/[questionId]/stream/stream';

const WEBCAM_ENDPOINT = 'http://127.0.0.1:5000/video_feed';

export default async function Answer({ params: {id, questionId}, searchParams: {answer} } ) {

  const response = await getQuiz(id);
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
          <div className='footer'>
            <h3>dab to move to the next question!</h3>
          </div>
          <div className='stream-container'>
            <h1>YOUR MOM</h1>
            <img src={WEBCAM_ENDPOINT} alt='webcam' />
          </div>
        </div>
      </div>
    </div>
  );
}
