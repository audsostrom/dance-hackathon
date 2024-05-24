/**
 * Configurations for handling redirects away from the profile page if user
 * attempts to access the profile page without signing in
 */
export const authConfig = {
	pages: {
		signIn: '/login',
	},
	providers: [
		// added later in auth.js
		'http://localhost:3000/',
	],
	callbacks: {
		authorized({auth, request: {nextUrl}}) {
         console.log('hi')
			const isLoggedIn = !!auth?.user;
			const isOnRestrictedPage = nextUrl.pathname.startsWith('/profile');

			// redirect unauthenticated users to login page
			if (isOnRestrictedPage) {
				if (isLoggedIn) return true;
				return false;
			} else if (isLoggedIn &&
				(nextUrl.pathname.startsWith('/login') ||
				nextUrl.pathname.startsWith('/register'))) {
				// and if they're signed in don't let them to the sign-in page
				return Response.redirect(new URL('/profile', nextUrl));
			}

			return true;
		},
	},
};