import { useState, useEffect, useRef } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { verifyEmail } from "../services/auth"
import Loader from "../components/Loader"
import { useNotification } from "../hooks/"

const EmailVerfication = () => {
	const navigate = useNavigate()
	const location = useLocation()
	const { updateNotification } = useNotification()

	const [loader, setLoader] = useState(false)
	const [activeOtpIndex, setActiveOtpIndex] = useState(0)
	const [err, setErr] = useState(false)
	let email = location?.state?.email || ""
	const [userHandle, domain] = email.split("@")
	const newUserHandle = userHandle.slice(0, 4) + "*".repeat(Math.max(0, userHandle.length - 4))

	const [otp, setOtp] = useState(new Array(6).fill(""))
	const inputRef = useRef()

	useEffect(() => {
		if (!location?.state && !location?.state?.email) {
			navigate("/register")
		}
	})

	useEffect(() => {
		inputRef.current?.focus()
	}, [activeOtpIndex])

	async function handleSubmit(e) {
		e.preventDefault()
		if (!otp) {
			return
		}
		setLoader(true)
		const isVerificationSuccessful = await verifyEmail({ email, otp: otp.join("") })
		updateNotification(isVerificationSuccessful)
		if (isVerificationSuccessful) {
			navigate("/")
		}

		setErr(true)
	}

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
		<>
			{loader ? (
				<Loader />
			) : (
				<div className="flex justify-center items-center h-100 w-full h-screen text-white dark:bg-primary">
					<form
						className="dark:bg-secondary  bg-white drop-shadow-lg px-5 py-4 rounded-md"
						onSubmit={handleSubmit}
					>
						<h2 className="dark:text-white text-black text-center text-xl font-semibold">
							Please Enter the otp to verify the account
						</h2>

						<p className="dark:text-white text-black">
							OTP has been sent to {newUserHandle}@{domain}
						</p>

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

						{err && (
							<p className="text-red-700 text-base text-center mt-3">
								OTP is incorrect
							</p>
						)}
					</form>
				</div>
			)}
		</>
	)
}

export default EmailVerfication
