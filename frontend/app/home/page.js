import './home.css';

import { signOut, auth } from '../auth';
import { getUser, getUserQuizzes, getAllQuizzes, getAllUsers } from '../db';
import { redirect } from 'next/navigation'
import Link from 'next/link';
import Carousel from './carousel/carousel';
import SignOut from '../../assets/images/sign-out.svg'
import Image from 'next/image';


function convertQuizToProp(quiz) {
	const newQuiz = {
		_id: quiz._id.toString(),
		creatorId: quiz.creatorId,
		questions: quiz.questions,
		title: quiz.title,
	}
	return newQuiz;

}
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
	const userQuizzes = (await getUserQuizzes(session?.user.email)).map(convertQuizToProp);
	const allQuizzes = (await getAllQuizzes()).map(convertQuizToProp);
	const allUsers = await getAllUsers(allQuizzes.map((quiz)=> quiz.creatorId))
	console.log(allUsers)

	return (
		<div className='home-container'>
			<div className="top-settings-row">
				<div className='top-bar'>
				<h1 className="title">home</h1>
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
						<Image src={SignOut}></Image>
					</button>
				</form>
				</div>
				<div className='your-decks'>
				<h2 className='subtitle'>Your study decks</h2>
				<Link style={{marginLeft: 'auto'}} href='/new-deck'>
					<button className='new-deck-button'>&#x2b; <i>make a new deck</i></button>
				</Link>

				</div>
				{userQuizzes && userQuizzes.length > 0 && <Carousel cards={userQuizzes} yours={true} users={allUsers.map((item)=>item.email)}></Carousel>}
				{userQuizzes && userQuizzes.length == 0 && <i>You don't have any personal study decks</i>}
				<h2 className='subtitle'>All Study Decks</h2>
				{allQuizzes && <Carousel cards={allQuizzes} yours={false} users={allUsers.map((item)=> ({[item._id.toString()]: item.email}))}></Carousel>}
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
		</div>
	);
}