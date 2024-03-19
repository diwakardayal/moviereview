import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { registerUser } from "../services/auth"
import Loader from "./Loader"
import { useNotification } from "../hooks"
import { useAuth } from "../hooks"

function validateFormFields({ username, email, password }) {
	const isValidEmail = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/

	if (!email.trim()) return { ok: false, error: "Email is missing!" }
	if (!isValidEmail.test(email)) return { ok: false, error: "Invalid email!" }
	if (!username.trim()) return { ok: false, error: "Username is missing!" }
	if (!password.trim()) return { ok: false, error: "Password is missing!" }
	if (password.length < 5) return { ok: false, error: "Password must be 6 character long!" }

	return { ok: true, error: "" }
}

const SignUpForm = () => {
	const navigate = useNavigate()
	const [userInfo, setUserInfo] = useState({
		username: "",
		email: "",
		password: "",
	})
	const { updateNotification } = useNotification()

	const [loader, setLoader] = useState(false)

	const { setUserInfoHandler } = useAuth()

	async function handleSubmit(e) {
		e.preventDefault()
		const { ok, error } = validateFormFields(userInfo)

		if (!ok) return updateNotification("error", error)

		let registrationSuccess
		try {
			setLoader(true)
			registrationSuccess = await registerUser(userInfo)
		} catch (e) {
			setLoader(false)
			updateNotification("error", "Something went wrong")
			return
		}
		if (registrationSuccess) {
			setUserInfoHandler({ email: userInfo.email, password: userInfo.password })
			await new Promise(resolve => setTimeout(resolve, 500))
			navigate("/verifyEmail", { state: { email: userInfo.email } })
		} else {
			return updateNotification("error", registrationSuccess)
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
								onChange={e =>
									setUserInfo({ ...userInfo, username: e.target.value })
								}
								id="username"
								className="border-2 dark:border-dark-subtle  border-gray-600 rounded p-1 dark:bg-secondary dark:text-white text-black"
								placeholder="John Doe"
							/>
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
								onChange={e => setUserInfo({ ...userInfo, email: e.target.value })}
								id="email"
								className="border-2 dark:border-dark-subtle  border-gray-600 rounded p-1 dark:bg-secondary dark:text-white text-black"
								placeholder="example@email.com"
							/>
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
								onChange={e =>
									setUserInfo({ ...userInfo, password: e.target.value })
								}
								className="border-2 dark:border-dark-subtle rounded p-1 border-gray-600 dark:bg-secondary dark:text-white text-black"
								placeholder="*************"
								type="password"
								id="password"
							/>
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
