
const SignInForm = () => {
	return (
		<div className="flex justify-center items-center h-100 w-full h-screen text-white bg-primary">
			<form className="bg-secondary px-4 py-3 rounded-md">
				<h2 className="text-center text-xl">Sign In</h2>
				<div className="flex flex-col space-y-2 mt-6">
					<label className="text-lg self-start" htmlFor="email">
						Email
					</label>
					<input id="email" className="p-1 text-black" placeholder="example@email.com" />
				</div>

				<div className="flex flex-col space-y-2 mt-5">
					<label className="text-lg self-start" htmlFor="password">
						Password
					</label>
					<input
						className="p-1 text-black"
						placeholder="*************"
						type="password"
						id="password"
					/>
				</div>
				<div className="text-center">
					<button className="text-center mt-5 bg-primary font-semibold text-lg w-full py-1">
						Sign in
					</button>
				</div>
				<div className="flex justify-between gap-1 text-gray-400 mt-5">
					<button>Forget password</button>
					<button>Sign up</button>
				</div>
			</form>
		</div>
	)
}

export default SignInForm
