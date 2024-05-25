import './profile.css';

import { signOut, auth } from '../auth';
import { getUser } from '../db';
import { redirect } from 'next/navigation'

/**
 * @return {*} – Renders the Profile page
 */
export default async function Profile() {
   const session = await auth();
   console.log(session?.user);
   if (!session) {
      redirect('/')
   }

	fetch
	const user = await getUser(session?.user.email);

	return (
		<div className='profile-container'>
         oop
         <div className="top-settings-row">
				<div className="subtitle">Settings</div>
            <div>{user.email}</div>
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