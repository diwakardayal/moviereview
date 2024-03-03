const nodemailer = require("nodemailer")
const emailVerificationOTPs = require("./emailVerificationOtps")

let transport = nodemailer.createTransport({
	host: "smtp.gmail.com",
	port: 465,
	auth: {
		user: process.env.GMAIL_APP_EMAIL,
		pass: process.env.GMAIL_APP_PASSWORD,
	},
})

async function sendOTPForVerification(senderEmailId) {
	let OTP = ""
	let digits = "0123456789"
	for (let i = 0; i < 6; i++) {
		OTP += digits[Math.floor(Math.random() * 10)]
	}

	emailVerificationOTPs[senderEmailId] = OTP

	try {
		const info = await transport.sendMail({
			from: `Movie Review <${process.env.GMAIL_APP_EMAIL}>`,
			to: senderEmailId,
			subject: "Email Verification",
			text: `Here is your OTP for email verification: ${OTP}`,
			html: `<b>Here is your OTP for email verification: ${OTP}</b>`,
		})

		console.log("Message sent: %s", info.messageId)
	} catch (e) {
		console.log(e)
	}
}

module.exports = sendOTPForVerification
