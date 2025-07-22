import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios from "axios";

@Injectable()
export class GeminiService {
	private readonly GEMINI_API_KEY: string;
	private readonly GEMINI_API_URL: string;

	constructor(private readonly configService: ConfigService) {
		this.GEMINI_API_KEY = this.configService.get<string>("GEMINI_API_KEY");

		const model = "gemini-1.5-flash";
		this.GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.GEMINI_API_KEY}`;
	}

	async generateExplanation(prompt: string): Promise<string> {
		const body = {
			contents: [
				{
					parts: [{ text: prompt }],
				},
			],
		};

		try {
			const response = await axios.post(this.GEMINI_API_URL, body, {
				headers: {
					"Content-Type": "application/json",
				},
			});

			const result = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
			return result || "Không có phản hồi từ AI.";
		} catch (error) {
			console.error(
				"❌ Lỗi gọi Gemini API:",
				error?.response?.data || error.message,
			);
			return "Đã xảy ra lỗi khi gọi AI.";
		}
	}
}
