
'use client';
import Link from 'next/link';
import './carousel.css'
import { useState } from 'react';
import RightArrow from '../../../assets/images/right-arrow.svg'
import LeftArrow from '../../../assets/images/left-arrow.svg'
import Image from 'next/image';

/**
 * @return {*} – Renders the Profile page
 */

export default function Carousel(props) {
   // href={`/quiz/${question._id.toString()}/question/1`}
   const [index, setIndex] = useState(0);

   const slideLeft = () => {
      if (props.cards.slice(index-1, index+3).length == 4) {
         setIndex((prevIndex) => (prevIndex - 1 + props.cards.length) % props.cards.length);
      }
    };

    console.log
  
    const slideRight = () => {
      if (props.cards.slice(index+1, index+5).length == 4) {
         setIndex((prevIndex) => (prevIndex  + 1) % props.cards.length);
      }
    };

      // Function to get email associated with creatorId
   function getEmailForCreatorId(users, creatorId) {
      // Find the user object corresponding to the creatorId
      const user = users.find(userObj => Object.keys(userObj)[0] === creatorId);
      // If user exists, return the email, otherwise return null
      return user ? user[creatorId] : null;
   }




	return (
		<div className='carousel-container'>
            {props.cards.length >= 4 && props.cards.slice(index-1, index+3).length == 4 && <button className='button' onClick={slideLeft}><Image src={LeftArrow}></Image></button>}
            {!(props.cards.slice(index-1, index+3).length == 4) && 
               <button className='button' onClick={slideLeft}>
               <Image className='grayed' src={LeftArrow}></Image>
            </button>}
            
            <div className='cards-wrapper'>
            {props.cards.slice(index, index+4).map((question, index) => (
               <div className='card-wrapper'>
               <Link className='card' key={index} href={`/quiz/${question._id.toString()}/question/0`}>
                  <div key={index}>
                     <div>{question.title}</div>
                  </div>
               
               </Link>
               {!props.yours && <div className='author'>by {getEmailForCreatorId(props.users, question.creatorId)}</div>}
               </div>
        		))}

            </div>
            {props.cards.length >= 4 && props.cards.slice(index+1, index+5).length == 4 &&
               <button className='button' onClick={slideRight}>
               <Image src={RightArrow}></Image>
            </button>}
            {!(props.cards.slice(index+1, index+5).length == 4) && 
               <button className='button' onClick={slideRight}>
               <Image className='grayed' src={RightArrow}></Image>
            </button>}
		</div>
	);
}