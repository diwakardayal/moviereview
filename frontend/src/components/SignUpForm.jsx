import { useState } from "react"
import { Link, useSearchParams } from "react-router-dom"

const SignUpForm = () => {
	const [username, setUsername] = useState()
	const [email, setEmail] = useState()
	const [password, setPassword] = useState()

	const handleSubmit = async e => {
		e.preventDefault()
	}
	return (
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
						id="username"
						className="border-2 dark:border-dark-subtle  border-gray-600 rounded p-1 dark:bg-secondary text-white"
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
						id="email"
						className="border-2 dark:border-dark-subtle  border-gray-600 rounded p-1 dark:bg-secondary text-white"
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
						className="border-2 dark:border-dark-subtle rounded p-1 border-gray-600 dark:bg-secondary text-white"
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
	)
}

export default SignUpForm
