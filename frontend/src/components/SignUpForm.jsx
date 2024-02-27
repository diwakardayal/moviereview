import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { registerUser } from "../services/auth"
import Loader from "./Loader"

const SignUpForm = () => {
	const navigate = useNavigate()
	const [userInfo, setUserInfo] = useState({
		username: "",
		email: "",
		password: "",
	})

	const [emailError, setEmailError] = useState(false)
	const [nameError, SetNameSetError] = useState(false)
	const [passwordError, setPasswordError] = useState(false)
	const [loader, setLoader] = useState(false)

	const handleSubmit = async e => {
		e.preventDefault()
		if (!emailError && !nameError && !passwordError) {
			setLoader(true)
			const registrationSuccess = await registerUser(userInfo)
			console.log("registrationSuccess: ", registrationSuccess)
			if (registrationSuccess) {
				await new Promise(resolve => setTimeout(resolve, 500))
				console.log("Registration Successful")
				navigate("/verifyEmail", { state: { email: userInfo.email } })
			}
		}
	}

	function validateFormFields(objectKey) {
		const { username, email, password } = objectKey
		if (objectKey.username === "" || objectKey.username) {
			if (!username) {
				SetNameSetError(true)
				return
			}
			setUserInfo(prevUserInfo => ({ ...prevUserInfo, username }))
			SetNameSetError(false)
			return
		}

		if (objectKey.email === "" || objectKey.email) {
			setUserInfo(prevUserInfo => ({ ...prevUserInfo, email }))
			if (/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/.test(objectKey.email.trim())) {
				setEmailError(false)
				return
			} else {
				setEmailError(true)
			}
		}
		if (objectKey.password === "" || objectKey.password) {
			setUserInfo(prevUserInfo => ({ ...prevUserInfo, password }))
			if (/^.{5,}$/.test(objectKey.password)) {
				setPasswordError(false)
				return
			}

			setPasswordError(true)
			return
		}
	}

	return (
		<>
			{loader ? (
				<Loader />
			) : (
				<div className="flex justify-center items-center h-100 w-full h-screen text-white dark:bg-primary">
					<form
						className="dark:bg-secondary bg-white drop-shadow-xl px-4 py-3 rounded-md"
						onSubmit={handleSubmit}
					>
						<h2 className="dark:text-white text-black text-center text-xl">Sign Up</h2>
						<div className="dark:text-white text-black flex flex-col space-y-2 mt-6">
							<label
								className="dark:text-white text-blacktext-lg self-start"
								htmlFor="username"
							>
								Name
							</label>
							<input
								value={userInfo.username}
								onChange={e => validateFormFields({ username: e.target.value })}
								id="username"
								className="border-2 dark:border-dark-subtle  border-gray-600 rounded p-1 dark:bg-secondary dark:text-white text-black"
								placeholder="John Doe"
							/>

							{nameError && (
								<p className="mt-3 text-red-700 text-sm">Please provide the name</p>
							)}
						</div>

						<div className="flex flex-col space-y-2 mt-6">
							<label
								className="dark:text-white text-black text-lg self-start"
								htmlFor="email"
							>
								Email
							</label>
							<input
								value={userInfo.email}
								onChange={e => validateFormFields({ email: e.target.value })}
								id="email"
								className="border-2 dark:border-dark-subtle  border-gray-600 rounded p-1 dark:bg-secondary dark:text-white text-black"
								placeholder="example@email.com"
							/>
							{emailError && (
								<p className="mt-3 text-red-700 text-sm">
									Please provide the correct email
								</p>
							)}
						</div>

						<div className="flex flex-col space-y-2 mt-5">
							<label
								className="dark:text-white text-black text-lg self-start"
								htmlFor="password"
							>
								Password
							</label>
							<input
								value={userInfo.password}
								onChange={e => validateFormFields({ password: e.target.value })}
								className="border-2 dark:border-dark-subtle rounded p-1 border-gray-600 dark:bg-secondary dark:text-white text-black"
								placeholder="*************"
								type="password"
								id="password"
							/>
							{passwordError && (
								<p className="mt-3 text-red-700 ">Please provide the password</p>
							)}
						</div>
						<div className="text-center">
							<button className="w-full rounded dark:bg-white bg-black dark:text-secondary text-white hover:bg-opacity-90 transition font-semibold text-lg cursor-pointer p-1 mt-5">
								Signup
							</button>
						</div>

						<div className="flex justify-center gap-1 dark:text-gray-400 text-gray-800 mt-5">
							<Link to="/login">Sign in</Link>
						</div>
					</form>
				</div>
			)}
		</>
	)
}

export default SignUpForm
