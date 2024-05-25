import User from '@/models/user';
import {NextResponse} from 'next/server';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import Quiz from '@/models/quiz';
import { ObjectId } from 'mongodb';


/**
 * The function connects to a MongoDB database
 * using the MONGODB_URI from the environment variables.
 */
export const connectMongoDB = async () => {
	try {
		console.log('im here')
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
		console.log('quiz 1')
		await connectMongoDB();
		console.log('quiz 2')


		// findOne() gives one document that matches the criteria
  		const objectId = ObjectId.createFromHexString(quizId);
		console.log('hi', objectId)
		const quiz = await Quiz.findOne({ _id: objectId});
		const returnVal = quiz === null ? null : quiz;
		console.log('returnVal', returnVal)
		return returnVal;
	} catch (error) {
		console.log(error)
		return NextResponse.json(
			{message: 'An error occurred while getting the quiz.'},
			{status: 500}
		);
	}
}