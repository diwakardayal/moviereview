import { Link } from "react-router-dom"

const ForgetPassword = () => {
	return (
		<div className="flex justify-center items-center h-100 w-full h-screen text-white bg-primary">
			<form className="bg-secondary px-4 py-3 rounded-md">
				<h2 className="text-center text-xl font-semibold">Please Enter Email</h2>

				<div className="flex flex-col space-y-2 mt-6">
					<label className="text-lg self-start" htmlFor="email">
						Email
					</label>
					<input
						id="email"
						className="p-1 bg-secondary border-2 border-dark-subtle text-white"
						placeholder="example@email.com"
					/>
				</div>

				<div className="text-center">
					<button className="w-full rounded bg-white text-secondary hover:bg-opacity-90 transition font-semibold text-lg cursor-pointer p-1 mt-5">
						Request new password
					</button>
				</div>
				<div className="flex justify-center gap-1 text-gray-400 mt-5">
					<Link to="/login">Sign in</Link>
				</div>
			</form>
		</div>
	)
}

export default ForgetPassword
