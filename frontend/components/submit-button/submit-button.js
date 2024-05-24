'use client';

import {useFormStatus} from 'react-dom';
import Stack from '@mui/material/Stack';
import {CircularProgress} from '@mui/material';
import './submit-button.css';

/**
 * @param {*} children - Whatever components or elements need to
 * be rendered inside of this component
 * @return {*} – A button for submitting form status (used in login pages)
 */
export function SubmitButton({children}) {
	const {pending} = useFormStatus();

	return (
		<button
			type={pending ? 'button' : 'submit'}
			aria-disabled={pending}
			className="submit-button"
		>
			{!pending && children}
			{pending && (
				<Stack sx={{color: 'white'}} direction="row">
					<CircularProgress color="inherit" />
				</Stack>
			)}
		</button>
	);
}
