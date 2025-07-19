import { Env } from "@utils";
import mongoose from "mongoose";

export async function initDbConnection() {
	const url = `mongodb://${Env.DB_HOST}:${Env.DB_PORT}`;
	await mongoose.connect(url, {
		dbName: Env.DB_NAME,
		user: Env.DB_USER,
		pass: Env.DB_PASS,
	});
}
