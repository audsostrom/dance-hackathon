import User from '@/models/user';
import {NextResponse} from 'next/server';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import Quiz from '@/models/quiz';
import { ObjectId } from 'mongodb';
import UserQuiz from '@/models/userQuiz';


/**
 * The function connects to a MongoDB database
 * using the MONGODB_URI from the environment variables.
 */
export const connectMongoDB = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URI);
	} catch (error) {
		console.log('im fail')
		console.error('Error connecting to MongoDB: ', error);
	}
};


/**
 * This function creates a new user in MongoDB with a hashed password and an
 * initial empty list of saved recipes.
 * @param {String} email -  Email address of the user that is being registered.
 * @param {String} password - Password that the user provides when registering.
 * This password is hashed with bcrypt before being stored for security.
 * @return {NextResponse} – Represents the operation's success (201 or 500).
 */
export async function createUser(email, password) {
	try {
		const hashedPassword = await bcrypt.hash(password, 10);
		await connectMongoDB();
		// create new user in database with no saved recipes to start
		await User.create({
			email,
			password: hashedPassword,
			savedRecipes: [],
			savedIngredients: [],
		});
		return NextResponse.json(
			{message: 'User registered.'},
			{status: 201}
		);
	} catch (error) {
		return NextResponse.json(
			{message: 'An error occurred while registering the user.'},
			{status: 500}
		);
	}
}

export async function createQuiz(email, questionSet, title) {
	try {
		await connectMongoDB();
		// create new user in database with no saved recipes to start
		const user = await getUser(email);
		await Quiz.create({
			creatorId: user._id.toString(),
			title: title,
			questions: questionSet,
		});

		return NextResponse.json(
			{message: 'Quiz created.'},
			{status: 201}
		);
	} catch (error) {
		return NextResponse.json(
			{message: 'An error occurred while creating the quiz.'},
			{status: 500}
		);
	}
}



/**
 * The function retrieves a user's email and password from MongoDB.
 * @param {String} email - Used for getting user from the database.
 * @return {User} - Return either the user object with only the `email` and
 * `password` fields (if found in the database), or `null` if no user with the
 * specified email is found.
 *
 * If an error occurs during the process, a NextResponse with an
 * error message and status code 500 is returned.
 */
export async function getUser(email) {
	try {
		await connectMongoDB();
		// findOne() gives one document that matches the criteria
		const user = await User.findOne(
			{email},
			{email: 1, password: 1}
		);
		const returnVal = user === null ? null : user;
		return returnVal;
	} catch (error) {
		return NextResponse.json(
			{message: 'An error occurred while getting the user.'},
			{status: 500}
		);
	}
}

export async function getQuiz(quizId) {
	try {
		await connectMongoDB();
		console.log('hi', quizId);
		// findOne() gives one document that matches the criteria
  		const objectId = ObjectId.createFromHexString(quizId);
		const quiz = await Quiz.findOne({ _id: objectId});
		const returnVal = quiz === null ? null : quiz;
		return returnVal;
	} catch (error) {
		console.log(error)
		return NextResponse.json(
			{message: 'An error occurred while getting the quiz.'},
			{status: 500}
		);
	}
}

export async function createUserQuiz(email, quizId) {
	try {
		await connectMongoDB();
		console.log(email)
		// findOne() gives one document that matches the criteria
		const user = await getUser(email);
		console.log(user)
		const quiz = await getQuiz(quizId);
		const userResponses = new Array(quiz.questions.length);

		console.log('we did it joe', user)
		await UserQuiz.create({
			userId: user._id.toString(),
			quizId: quizId,
			responses: userResponses
		});
		return NextResponse.json(
			{message: 'User Quiz created.'},
			{status: 201}
		);

	} catch (error) {
		console.log(error)
		return NextResponse.json(
			{message: 'An error occurred while getting the quiz.'},
			{status: 500}
		);
	}

}


export async function getUserResponse(email, quizId, questionNumber, answer) {
	try {
		await connectMongoDB();
		console.log(email)
		// findOne() gives one document that matches the criteria
		const user = await getUser(email);
		const userQuizzes = await UserQuiz.find({userId: user._id.toString(), quizId: quizId}).sort({'createdAt':-1})  //1 for ascending and -1 for descending;

		console.log(userQuizzes)
		console.log(user)
		if (userQuizzes) {
			await UserQuiz.findOneAndUpdate(
				{ _id: userQuizzes[0]._id },
				{
				  $set: {
					 [`responses.${questionNumber}`]: answer,
				  },
				}
			);
			if (userQuizzes.length > 1){
				return userQuizzes[1]
			}

		}
		else {
			return null
		}

		return NextResponse.json(
			{message: 'User Quiz found.'},
			{status: 201}
		);

	} catch (error) {
		console.log(error)
		return NextResponse.json(
			{message: 'An error occurred while getting the quiz.'},
			{status: 500}
		);
	}

}
export async function getLastUserResponse(email, quizId, answer) {
	try {
		await connectMongoDB();
		console.log(email)
		// findOne() gives one document that matches the criteria
		const user = await getUser(email);
		const userQuizzes = await UserQuiz.find({userId: user._id.toString(), quizId: quizId}).sort({'createdAt':-1})  //1 for ascending and -1 for descending;

		return userQuizzes[0] ? userQuizzes[0] : null;

	} catch (error) {
		console.log(error)
		return NextResponse.json(
			{message: 'An error occurred while getting the quiz.'},
			{status: 500}
		);
	}

}

export async function getUserQuizzes(email) {
	try {
		await connectMongoDB();
		// findOne() gives one document that matches the criteria
		const user = await User.findOne({email});
		const userId = user._id.toString()
		const quizzes = await Quiz.find({creatorId: userId});
		const returnVal = quizzes === null ? null : quizzes;
		return returnVal;

	} catch (error) {
		console.log(error)
		return NextResponse.json(
			{message: 'An error occurred while getting the quiz.'},
			{status: 500}
		);
	}

}

export async function getAllUsers(ids) {
	try {
		await connectMongoDB();
		const objectIds = ids.map((id) => ObjectId.createFromHexString(id));
		const users = await User.find( { _id : { $in : objectIds } } );
		const returnVal = users === null ? null : users;
		return returnVal;
	} catch (error) {
		console.log(error)
		return NextResponse.json(
			{message: 'An error occurred while getting users.'},
			{status: 500}
		);
	}

}

export async function getAllQuizzes() {
	try {
		await connectMongoDB();
		const quizzes = await Quiz.find();
		const returnVal = quizzes === null ? null : quizzes;
		return returnVal;
	} catch (error) {
		console.log(error)
		return NextResponse.json(
			{message: 'An error occurred while getting the quiz.'},
			{status: 500}
		);
	}

}