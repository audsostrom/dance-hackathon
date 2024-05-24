import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import {getUser} from './db';
import {compare} from 'bcrypt';
import {authConfig} from './auth.config';

/**
 * Handles attempts for the user to login and any checks for credentials
 * during the current session
 */
export const {
	handlers: {GET, POST},
	auth,
	signIn,
	signOut,
} = NextAuth({
	...authConfig,
	providers: [
		Credentials({
			async authorize(credentials) {
				try {
					const user = await getUser(credentials['email']);
					if (!user) return null;
					const passwordsMatch = await compare(
						credentials['password'], user['password']
					);
					if (passwordsMatch) {
						return {
							email: credentials['email'],
						};
					} else {
						return null;
					}
				} catch (error) {
					return null;
				}
			},
		}),
	],
});