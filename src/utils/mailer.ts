import * as nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
	host: process.env.EMAIL_HOST,
	port: +process.env.EMAIL_PORT,
	secure: false,
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS,
	},
});

export async function sendVerificationEmail(email: string, token: string) {
	const verifyUrl = `${process.env.FRONTEND_VERIFY_URL}?token=${token}`;

	const mailOptions = {
		from: process.env.EMAIL_FROM,
		to: email,
		subject: "Xác thực tài khoản Nekolingo",
		html: `
			<h3>Chào mừng bạn đến với Nekolingo 🎉</h3>
			<p>Vui lòng nhấn vào nút bên dưới để xác thực tài khoản:</p>
			<p><a href="${verifyUrl}" style="padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none;">Xác thực tài khoản</a></p>
			<p>Nếu bạn không đăng ký, vui lòng bỏ qua email này.</p>
		`,
	};

	await transporter.sendMail(mailOptions);
}
