import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"

const EmailVerfication = () => {
	const [activeOtpIndex, setActiveOtpIndex] = useState(0)
	let email = "diwakardayal65@gmail.com"
	const [userHandle, domain] = email.split("@")
	const newUserHandle = userHandle.slice(0, 4) + "*".repeat(Math.max(0, userHandle.length - 4))

	const [otp, setOtp] = useState(new Array(6).fill(""))
	const inputRef = useRef()

	useEffect(() => {
		inputRef.current?.focus()
	}, [activeOtpIndex])

	function focusNextInputField(index) {
		setActiveOtpIndex(index => index + 1, index)
	}

	function focusPrevInputField(index) {
		const diff = index - 1
		let nextIndex = diff !== 0 ? diff : 0
		setActiveOtpIndex(nextIndex)
	}

	const handleOTPBox = ({ target }, index) => {
		const { value } = target
		const newOtp = [...otp]

		newOtp[index] = value.substring(value.length - 1, value.length)
		setOtp([...newOtp])

		if (!value) {
			focusPrevInputField(index)
		} else {
			focusNextInputField(index)
		}
	}
	return (
		<div className="flex justify-center items-center h-100 w-full h-screen text-white dark:bg-primary">
			<form className="dark:bg-secondary  bg-white drop-shadow-lg px-5 py-4 rounded-md">
				<h2 className="dark:text-white text-black text-center text-xl font-semibold">
					Please Enter the otp to verify the account
				</h2>

				<p className="dark:text-white text-black">
					OTP has been sent to {newUserHandle}@{domain}
				</p>

				<div className="dark:text-white text-black flex flex-col space-y-2 mt-6">
					<label className="text-lg self-start" htmlFor="email">
						Email
					</label>
					<input
						id="email"
						className="p-1 rounded dark:bg-secondary border-2 dark:border-dark-subtle text-white"
						placeholder="example@email.com"
					/>
				</div>

				<div className="flex flex-wrap gap-2 justify-around mt-5 items-center">
					{otp.map((_, index) => (
						<input
							ref={activeOtpIndex === index ? inputRef : null}
							onChange={e => handleOTPBox(e, index)}
							value={otp[index] || ""}
							type="number"
							key={index}
							className="spin-button-none h-12 w-12 border-2 rounded dark:text-white text-black dark:bg-secondary p-4 font-semibold text-xl"
						/>
					))}
				</div>

				<div className="text-center">
					<button className="w-full rounded dark:bg-white dark:text-black text-white bg-black hover:bg-opacity-90 transition font-semibold text-lg cursor-pointer p-1 mt-5">
						Verify Account
					</button>
				</div>
				<div className="flex justify-center gap-1 text-gray-400 mt-5">
					<Link to="/login" className="hover:underline">
						Sign in
					</Link>
				</div>
			</form>
		</div>
	)
}

export default EmailVerfication
