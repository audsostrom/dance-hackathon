import './profile.css';

import { signOut, auth } from '../auth';
import { getUser, getUserQuizzes, getAllQuizzes } from '../db';
import { redirect } from 'next/navigation'
import Link from 'next/link';

/**
 * @return {*} – Renders the Profile page
 */
export default async function Home() {
   const session = await auth();
   console.log(session?.user);
   if (!session) {
      redirect('/')
   }

	const user = await getUser(session?.user.email);
	const userQuizzes = await getUserQuizzes(session?.user.email);
	const allQuizzes = await getAllQuizzes();


	return (
		<div className='home-container'>
         oop
         <div className="top-settings-row">
				<div className="subtitle">Home</div>
            <div>{user.email}</div>
				<h1>Your study decks</h1>
				{userQuizzes.map((question, index) => (
					<Link href={`/quiz/${question._id.toString()}/question/1`}>
					   <p key={index}>{question.title}</p>
					</Link>
        		))}
				<h1>All Study Decks</h1>
				{allQuizzes.map((question, index) => (
					<Link href={`/quiz/${question._id.toString()}/question/1`}>
						<p key={index}>{question.title}</p>
					</Link>
        		))}
				<form
					className="sign-out"
					action={async () => {
						'use server';
						await signOut();
                  redirect('/')
					}}
				>
					<button className="sign-out-button" type="submit">
						<div>Sign Out</div>
					</button>
				</form>
			</div>
		</div>
	);
}