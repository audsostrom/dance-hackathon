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
				<h1 className="subtitle">Home</h1>
            <div>{user.email}</div>
				<h2>Your study decks</h2>
				{userQuizzes.map((question, index) => (
					<Link href={`/quiz/${question._id.toString()}/question/1`}>
					   <p key={index}>{question.title}</p>
					</Link>
        		))}
				<h2>All Study Decks</h2>
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