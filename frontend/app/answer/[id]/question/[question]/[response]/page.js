
import { getQuiz } from '@/app/db';
import './answer.css';
import Link from 'next/link';
export default async function Answer({params}) {
  const response = await getQuiz('665275c489dd025e05f8a5b7');
  console.log('hi', response)
  console.log('params', params)
  
  const question = response.questions[Number(params['question'])-1];
  console.log(question, Number(params['question']), response)




	return (
      <div>
        <h1>The correct answer to the question "{question.question}" was...</h1>
        <div>{question.options[question.answer]}</div>
        <h2>You answered {question.options[Number(params['response'])]}</h2>
        {
          (Number(params['question']) - 1 < response.questions.length - 1) &&         
          
          <Link href={`/quiz/${response._id.toString()}/question/${Number(params['question']) + 1}`}>
            <button>next question</button>
          </Link>

        }
                {
          (Number(params['question']) - 1 >= response.questions.length - 1) &&         
          
          <Link href={`/home`}>
            <button>you're done</button>
          </Link>

        }

      </div>
	);
}