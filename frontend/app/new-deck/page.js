'use client';
import Link from 'next/link';
import './new-deck.css';
import { useState } from 'react';
import { makeQuiz } from './create-quiz';

export default function NewDeck() {
      const [deckTitle, setDeckTitle] = useState("");
  const [inputFields, setInputFields] = useState([{ question: "", correctAnswer: "" }]);

  // Function to add a new input field
  const handleAddFields = () => {
    setInputFields([...inputFields, { question: "", correctAnswer: "" }]);
  };

      // Function to update the title of the whole set
      const handleDeckTitleChange = (event) => {
      setDeckTitle(event.target.value);
      };

  // Function to remove an input field by index
  const handleRemoveFields = (index) => {
    const newInputFields = [...inputFields];
    newInputFields.splice(index, 1);
    setInputFields(newInputFields);
  };


  // Function to update the title of an input field
  const handleTitleChange = (index, event) => {
    const values = [...inputFields];
    values[index].question = event.target.value;
    setInputFields(values);
  };

  // Function to update the value of an input field
  const handleValueChange = (index, event) => {
    const values = [...inputFields];
    values[index].correctAnswer = event.target.value;
    console.log(values)
    setInputFields(values);
  };

  return (
    <div className="new-deck-container">
      <div className='content'>
      <h1 className='title'>make your own study deck</h1>

<h2 className='subtitle'>Enter your questions and their correct answers, and we'll generate some multiple-choice questions based on it!</h2>

      {/* Title for the whole set */}
      <input
        type="text"
        className='enter-title'
        placeholder="Enter a title for the set"
        value={deckTitle}
        onChange={handleDeckTitleChange}
      />
{inputFields.map((inputField, index) => (
<div className='input-wrapper'>
      <div className='question-number'>Question {index+1}</div>
<div className="input-container" key={index}>

<input
  type="text"
  placeholder="Enter a question"
  value={inputField.question}
  onChange={(e) => handleTitleChange(index, e)}
/>
<input
  type="text"
  className='correct-answer-box'
  placeholder="Enter the correct answer to the question"
  value={inputField.correctAnswer}
  onChange={(e) => handleValueChange(index, e)}
/>
<button className="delete-btn" onClick={() => handleRemoveFields(index)}>
  <span className="material-symbols-outlined delete-icon">delete</span>
</button>
</div>
</div>

))}

<div className='button-row'>
<button className="add-btn" onClick={handleAddFields}>
  <span>&#x2b; Add Question</span>
</button>
<button className="submit-btn" onClick={() => makeQuiz(inputFields, deckTitle)}>
      <span>&#x2713; Submit</span>
</button>

</div>


      </div>
    </div>
  );
}
