import { Link } from "react-router-dom"
import { useContext } from "react"
import { ThemeContext } from "../context/ThemeProvider"

const SignInForm = () => {
	const context = useContext(ThemeContext)
	console.log(context)

	return (
		<div className="flex justify-center items-center h-100 w-full h-screen text-white dark:bg-primary">
			<form className="dark:bg-secondary  bg-white drop-shadow-xl px-4 py-3 rounded-md">
				<h2 className="text-center text-xl">Sign In</h2>
				<div className="flex flex-col space-y-2 mt-6">
					<label
						className="dark:text-white text-black text-lg self-start "
						htmlFor="email"
					>
						Email
					</label>
					<input
						id="email"
						className="border-2 dark:border-dark-subtle border-rounded p-1 dark:bg-secondary text-white bg-white"
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
						className="border-2 dark:border-dark-subtle border-gray rounded p-1 dark:bg-secondary text-white bg-white"
						placeholder="*************"
						type="password"
						id="password"
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
					<button></button>
				</div>
			</form>
		</div>
	)
}

export default SignInForm
