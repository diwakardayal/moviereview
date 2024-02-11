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
		<div className="flex justify-center items-center h-100 w-full h-screen text-white bg-primary">
			<form className="bg-secondary px-4 py-3 rounded-md" onSubmit={handleSubmit}>
				<h2 className="text-center text-xl">Sign Up</h2>
				<div className="flex flex-col space-y-2 mt-6">
					<label className="text-lg self-start" htmlFor="username">
						Name
					</label>
					<input
						id="username"
						className="border-2 border-dark-subtle   rounded p-1 bg-secondary text-white"
						placeholder="John Doe"
					/>
				</div>

				<div className="flex flex-col space-y-2 mt-6">
					<label className="text-lg self-start" htmlFor="email">
						Email
					</label>
					<input
						id="email"
						className="border-2 border-dark-subtle   rounded p-1 bg-secondary text-white"
						placeholder="example@email.com"
					/>
				</div>

				<div className="flex flex-col space-y-2 mt-5">
					<label className="text-lg self-start" htmlFor="password">
						Password
					</label>
					<input
						className="border-2 border-dark-subtle lrounded p-1 bg-secondary text-white"
						placeholder="*************"
						type="password"
						id="password"
					/>
				</div>
				<div className="text-center">
					<button className="w-full rounded bg-white text-secondary hover:bg-opacity-90 transition font-semibold text-lg cursor-pointer p-1 mt-5">
						Signup
					</button>
				</div>
				<div className="flex justify-center gap-1 text-gray-400 mt-5">
					<Link to="/login">Sign in</Link>
				</div>
			</form>
		</div>
	)
}

export default SignUpForm
