import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Loader from "./Loader"
import { login } from "../services/auth"
import { useNotification } from "../hooks"

function validateFormFields({ email, password }) {
	const isValidEmail = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/

	if (!email.trim()) return { ok: false, error: "Email is missing!" }
	if (!isValidEmail.test(email)) return { ok: false, error: "Invalid email!" }

	if (!password.trim()) return { ok: false, error: "Password is missing!" }
	if (password.length < 5) return { ok: false, error: "Password must be 6 character long!" }

	return { ok: true, error: "O" }
}

const SignInForm = () => {
	const [loader, setLoader] = useState(false)

	const [userInfo, setUserInfo] = useState({
		email: "",
		password: "",
	})

	const { updateNotification } = useNotification()

	const navigate = useNavigate()

	async function handleLogin(e) {
		e.preventDefault()

		const { ok, error } = validateFormFields(userInfo)

		if (!ok) return updateNotification("error", error)

		try {
			await login(userInfo)
			setLoader(true)
			setLoader(false)
			navigate("/")
		} catch (e) {
			updateNotification("error", "Invalid credentails")
		}
	}

	function handleFormChange({ target }) {
		const { name, value } = target
		setUserInfo({ ...userInfo, [name]: value })
	}

	return (
		<>
			{loader ? (
				<Loader />
			) : (
				<div className="flex justify-center items-center h-100 w-full h-screen text-white dark:bg-primary">
					<form
						className="dark:bg-secondary  bg-white drop-shadow-xl px-4 py-3 rounded-md"
						onSubmit={handleLogin}
					>
						<h2 className="dark:text-white  text-black text-center text-xl font-bold">
							Sign In
						</h2>
						<div className="flex flex-col mt-6">
							<label
								className="dark:text-white text-black text-lg self-start"
								htmlFor="email"
							>
								Email
							</label>
							<input
								value={userInfo.email}
								onChange={handleFormChange}
								id="email"
								className="bg-transparent border-2 dark:border-dark-subtle border-rounded p-1 dark:bg-secondary dark:text-white text-black bg-white peer transition"
								placeholder="example@email.com"
								name="email"
							/>
						</div>

						<div className="flex flex-col  mt-5">
							<label
								className="dark:text-white text-black text-lg self-start"
								htmlFor="password"
							>
								Password
							</label>
							<input
								value={userInfo.password}
								onChange={handleFormChange}
								className="border-2 dark:border-dark-subtle border-gray rounded p-1 dark:bg-secondary text-white bg-white"
								placeholder="*************"
								type="password"
								id="password"
								name="password"
							/>
						</div>

						<div className="text-center">
							<button className="w-full rounded dark:bg-white bg-secondary dark:text-secondary text-white hover:bg-opacity-90 transition font-semibold text-lg cursor-pointer p-1 mt-5">
								login
							</button>
						</div>
						<div className="flex justify-between gap-1 dark:text-gray-400 text-gray-800 mt-5">
							<Link to="/forgetPassword">Forget password</Link>
							<Link to="/register">Sign up</Link>
						</div>
					</form>
				</div>
			)}
		</>
	)
}

export default SignInForm
