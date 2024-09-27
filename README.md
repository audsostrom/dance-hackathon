# DanceBrains

[DevPost Link](https://devpost.com/software/dancebrains)

## What it does
On DanceBrains, instead reciting through flashcards, you can dance through them! For your study set, you can choose what dance moves correlates with an answer on screen. Say for a multiple choice question with choices: A, B, C and D, we can map A to a shuffle or B to a spin. To answer, you gotta dance!

## How we built it
Our web application is built using React as the frontend and Flask as the backend. We utilize OpenCV computer vision libraries to map movements to answers.

## Challenges we ran into
Training the model to match training data to dance moves was a huge challenge. The model sometimes hallucinated on certain dance moves and miss categorized them.

## Accomplishments that we're proud of
We're both never have worked with OpenCV before or integrating it with a NextJS app as well as a Flask backend. So coming this far and creating a working product is really exciting for us!

## What we learned
There were a lot of moving parts in our application (OpenCV, NextJS, Flask) and stitching them together was a challenge that we had had to overcome to create a working application. We quickly learned that communication and defining coding styles is important to make sure everything fit together seamlessly.

## What's next for DanceBrains!
We want to create more features for the user such as uploading their own dance moves and creating more diverse study sets!
