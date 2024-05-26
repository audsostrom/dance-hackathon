import './home.css';

import { signOut, auth } from '../auth';
import { getUser, getUserQuizzes, getAllQuizzes } from '../db';
import { redirect } from 'next/navigation'
import Link from 'next/link';
import Carousel from './carousel/carousel';

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
			<div className="area" >
			<div className="top-settings-row">
				<h1 className="title">home</h1>
				<h2 className='subtitle'>Your study decks</h2>
				{allQuizzes && <Carousel cards={userQuizzes}></Carousel>}
				<h2 className='subtitle'>All Study Decks</h2>
				{allQuizzes && <Carousel cards={allQuizzes}></Carousel>}
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
            <ul className="circles">
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
            </ul>
    		</div >
		</div>
	);
}