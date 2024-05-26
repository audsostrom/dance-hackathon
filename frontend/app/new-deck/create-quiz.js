'use server';
import {redirect} from 'next/navigation';
import {auth} from '../auth';
import { createQuiz } from '../db';

/**
 * The function `storeIngredients` saves ingredients preferences
 * and redirects to a dietary page based on the response.
 * @param {Array} ingredients - An array of ingredients to store.
 */
export async function makeQuiz(questions, title) {
	const session = await auth();
   /**
   const response = await fetch('http://127.0.0.1:5000/get-fake-answers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'message': questions })
        });

   if (!response.ok) {
      throw new Error('Network response was not ok');
   }

   
   const result = await response.json();
   const fakeAnswers = JSON.parse(result.response);
    */
  console.log('questions',questions)
   const fakeAnswers = [
		{
		  'fake-answers': ['Alexander Hamilton', 'John Adams', 'Benjamin Franklin']
		},
		{
		  'fake-answers': ['Fort Davis', 'Amache National Historic Site', 'Acadia National Park']
		},
	 ];
	 console.log(typeof questions)
	 const combinedArray = questions.map((questionObj, index) => {
		const fakeAnswerList = fakeAnswers[index]['fake-answers'];
		const correctAnswer = questionObj.correctAnswer;
	 
		// Combine correct and fake answers
		let options = [correctAnswer, ...fakeAnswerList];
	 
		// Shuffle the options array
		options = options.sort(() => Math.random() - 0.5);
	 
		// Find the index of the correct answer in the shuffled array
		const correctAnswerIndex = options.indexOf(correctAnswer);
	 
		return {
		  question: questionObj.question,
		  options: options,
		  answer: correctAnswerIndex
		};
	 });
	 
	 console.log('hi', combinedArray);
	if (session?.user?.email) {
      console.log('peepeepoo')
		await createQuiz(session?.user?.email, combinedArray, title);
	}
	redirect(`/home`);
}