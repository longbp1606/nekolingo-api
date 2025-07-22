export function buildExplainAnswerPrompt({
	question,
	correctAnswer,
	userAnswer,
	grammarName,
	isMistake,
}: {
	question: string;
	correctAnswer: string;
	userAnswer: string;
	grammarName?: string;
	isMistake: boolean;
}) {
	return `
Người học vừa làm một bài tập:

❓ Câu hỏi: ${question}
✅ Đáp án đúng: ${correctAnswer}
📝 Câu trả lời của học viên: ${userAnswer}
📘 Ngữ pháp liên quan: ${grammarName || "Không có"}

Bạn hãy giải thích ngắn gọn tại sao câu trả lời của học viên là ${isMistake ? "sai" : "đúng"}.
- Giải thích đơn giản, rõ ràng.
- Nếu sai, hãy gợi ý cách sửa đúng.
- Trình bày như một trợ lý học ngôn ngữ thân thiện.
`;
}
