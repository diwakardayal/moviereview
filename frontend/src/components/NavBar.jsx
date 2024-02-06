import { BsFillSunFill } from "react-icons/bs"

const NavBar = () => {
	return (
		<div className="bg-secondary">
			<div className="text-white w-4/5 flex items-center justify-between mx-auto p-2">
				<img src="/images/logo.png" alt="logo" />
				<div className="flex gap-3 items-center">
					<button className="bg-gray-400 p-1 rounded">
						<BsFillSunFill className="text-secondary" size={24} />
					</button>
					<input
						placeholder="search"
						className="border-2 border-dark-subtle px-2 py-1 rounded-sm text-black bg-transparent"
					/>
					<p>Login</p>
				</div>
			</div>
		</div>
	)
}

export default NavBar
