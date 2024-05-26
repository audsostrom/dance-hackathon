

import Link from 'next/link';
import './carousel.css'

/**
 * @return {*} – Renders the Profile page
 */
export default function Carousel(props) {
   console.log('props', props)

	return (
		<div className='carousel-container'>
            <button>left arrow</button>
            {props.cards.map((question, index) => (
						<div className='card' key={index}>
                     <Link href={`/quiz/${question._id.toString()}/question/1`}>
                     <div>{question.title}</div>
                     </Link>
                  </div>
        		))}
            <button>left arrow</button>
		</div>
	);
}