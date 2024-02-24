import { Link } from "react-router-dom"

const ForgetPassword = () => {
	return (
		<div className="flex justify-center items-center h-100 w-full h-screen text-white dark:bg-primary">
			<form className="dark:bg-secondary bg-white drop-shadow-xl px-4 py-3 rounded-md">
				<h2 className="dark:text-white text-black text-center text-xl font-semibold">
					Enter Your Email
				</h2>

				<div className="flex flex-col space-y-2 mt-6">
					<label
						className="dark:text-white text-black text-lg self-start"
						htmlFor="email"
					>
						Email
					</label>
					<input
						id="email"
						className="rounded p-2 dark:bg-secondary border-2 dark:border-dark-subtle border-gray-600 text-white"
						placeholder="example@email.com"
					/>
				</div>

				<div className="text-center">
					<button className="w-full rounded dark:bg-white bg-black dark:text-secondary hover:bg-opacity-90 transition font-semibold text-lg cursor-pointer p-1 mt-5">
						Request new password
					</button>
				</div>
				<div className="flex justify-center gap-1 dark:text-gray-400 text-gray-700 mt-5">
					<Link to="/login">Sign in</Link>
				</div>
			</form>
		</div>
	)
}

export default ForgetPassword
