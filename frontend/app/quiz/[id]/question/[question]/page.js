
import { getQuiz } from '@/app/db';
import './quiz.css';
import { StreamComponent } from './stream/stream';
import { redirect } from 'next/navigation';

const WEBCAM_ENDPOINT = "http://127.0.0.1:5000/video_feed"
export default async function Quiz({params}) {

  const response = await getQuiz('665275c489dd025e05f8a5b7');
  console.log('hi', response)
  console.log('params', params)




	return (
      <div>
         <img width={400} height={400} src={WEBCAM_ENDPOINT} alt="webcam" />
         <StreamComponent />
         {/** print out options */}
         {response.questions[0].options.map((question, index) => (
          <p key={index}>{question}</p>
        ))}
      </div>
	);
}