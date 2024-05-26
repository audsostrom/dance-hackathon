
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
         {response.questions[Number(params['question'])].options.map((option, index) => (
          (index == 0 && <p key={index}>{option} <i>{'(dab for this option)'}</i></p>)
          (index == 1 && <p key={index}>{option} <i>{'(whip for this option)'}</i></p>)
          (index == 3 && <p key={index}>{option} <i>{'(squidward for this option)'}</i></p>)
          (index == 4 && <p key={index}>{option} <i>{'(idk for this option)'}</i></p>)
        ))}
      </div>
	);
}