export function buildExplainAnswerPrompt({
	question,
	correctAnswer,
	userAnswer,
	grammarName,
	isMistake,
}: {
	question: string;
	correctAnswer: string | string[] | number | object | object[];
	userAnswer: string | string[] | number | object | object[];
	grammarName?: string;
	isMistake: boolean;
}) {
	const formatValue = (value: any): string => {
		if (Array.isArray(value)) {
			return value.map(formatValue).join(", ");
		}
		if (typeof value === "object" && value !== null) {
			try {
				return Object.entries(value)
					.map(([k, v]) => `${k}: ${v}`)
					.join(", ");
			} catch {
				return JSON.stringify(value);
			}
		}
		return String(value);
	};

	return `
Người học vừa làm một bài tập:

❓ Câu hỏi: ${question}
✅ Đáp án đúng: ${formatValue(correctAnswer)}
📝 Câu trả lời của học viên: ${formatValue(userAnswer)}
📘 Ngữ pháp liên quan: ${grammarName || "Không có"}

Bạn hãy giải thích ngắn gọn tại sao câu trả lời của học viên là ${
		isMistake ? "sai" : "đúng"
	}.
- Giải thích đơn giản, rõ ràng.
- Nếu sai, hãy gợi ý cách sửa đúng.
- Trình bày như một trợ lý học ngôn ngữ thân thiện.
`.trim();
}
