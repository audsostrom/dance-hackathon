
import { getQuiz } from '@/app/db';
import './quiz.css';
import { StreamComponent } from './stream/stream';
import { redirect } from 'next/navigation';

const WEBCAM_ENDPOINT = "http://127.0.0.1:5000/video_feed"
export default async function Quiz({params}) {

  const response = await getQuiz('665275c489dd025e05f8a5b7');
  console.log('hi', response)
  console.log('params', params)


  const danceOptions = {
    'dab': 0,
    'whip': 1,
    'squidward': 2,
    'come up with fourth move': 3
  }



	return (
      <div>
         <img width={400} height={400} src={WEBCAM_ENDPOINT} alt="webcam" />
         <StreamComponent />
         {/** print out options */}
         {response.questions[Number(params['question'])-1].options.map((option, index) => (
          <p key={index}>
            {option}
            {index === 0 && <i> {'(dab for this option)'}</i>}
            {index === 1 && <i> {'(whip for this option)'}</i>}
            {index === 2 && <i> {'(squidward for this option)'}</i>}
            {index === 3 && <i> {'(idk for this option)'}</i>}
          </p>
        ))}
      </div>
	);
}