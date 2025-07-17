import { config } from "dotenv";

config();

export const Env = {
	LISTEN_PORT: parseInt(process.env.LISTEN_PORT || "3000"),

	DB_HOST: process.env.DB_HOST || "localhost",
	DB_PORT: parseInt(process.env.DB_PORT || ""),
	DB_NAME: process.env.DB_NAME || "",
	DB_USER: process.env.DB_USER || "",
	DB_PASS: process.env.DB_PASS || "",

	ENABLE_SWAGGER: (process.env.ENABLE_SWAGGER || "false") == "true",

	JWT_AT_SECRET: process.env.JWT_AT_SECRET || "",
	JWT_AT_EXPIRATION_TIME: parseInt(process.env.JWT_AT_EXPIRES_IN || "300"),
	JWT_RT_SECRET: process.env.JWT_RT_SECRET || "",
	JWT_RT_EXPIRATION_TIME: parseInt(process.env.JWT_RT_EXPIRES_IN || "86400"),

	VNP_TMNCODE: process.env.VNP_TMNCODE || "",
	VNP_HASH_SECRET: process.env.VNP_HASH_SECRET || "",
	VNP_RETURN_URL: process.env.VNP_RETURN_URL || "",
	VNP_API_URL: process.env.VNP_API_URL || "",

	CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "",
	CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "",
	CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || "",
} as const;

console.log(Env);
