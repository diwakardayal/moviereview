import { BsFillSunFill } from "react-icons/bs"
import { useTheme } from "../hooks/"
import { useAuth } from "../hooks/"
import { Link } from "react-router-dom"

const NavBar = () => {
	const { toggleTheme } = useTheme()
	const { user, handleLogout } = useAuth()

	return (
		<div className="bg-secondary">
			<div className="text-white w-4/5 flex flex-col md:flex-row items-center justify-between mx-auto p-2 gap-5">
				<Link to="/">
					<img src="/images/logo.png" alt="logo" />
				</Link>
				<div className="flex gap-3 items-center">
					<button className="dark:bg-gray-400 bg-white p-1 rounded" onClick={toggleTheme}>
						<BsFillSunFill className="text-secondary" size={24} />
					</button>
					<input
						placeholder="search"
						className="border-2 border-dark-subtle px-2 py-1 rounded-sm bg-transparent text-white"
					/>
					{user ? (
						<button onClick={handleLogout}>Logout</button>
					) : (
						<Link to="/login">Login</Link>
					)}
				</div>
			</div>
		</div>
	)
}

export default NavBar
