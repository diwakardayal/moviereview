/* eslint-disable react/prop-types */
import { Link, NavLink } from "react-router-dom"
import { AiOutlineHome } from "react-icons/ai"
import { BiMoviePlay } from "react-icons/bi"
import { FaUserNinja } from "react-icons/fa"
import { FiLogOut } from "react-icons/fi"
import { useAuth } from "../hooks/index"

const NavBar = () => {
	const { handleLogout } = useAuth()
	return (
		<nav className="w-48 min-h-screen bg-secondary border-r border-gray-300 flex flex-col justify-between">
			<ul className="pl-5 sticky top-0">
				<li className="mb-8">
					<Link to="/">
						<img src="./images/logo.png" alt="logo" className="h-14 p-2" />
					</Link>
				</li>
				<li>
					<NavItem to="/">
						<AiOutlineHome />
						<span>Home</span>
					</NavItem>
				</li>
				<li>
					<NavItem to="/movies">
						<BiMoviePlay />
						<span>Movies</span>
					</NavItem>
				</li>
				<li>
					<NavItem to="/actors">
						<FaUserNinja />
						<span>Actors</span>
					</NavItem>
				</li>
			</ul>

			<div className="flex flex-col items-start p-5">
				<span className="font-semibold text-white text-lg">Admin</span>

				<button className="flex items-center text-dark-subtle text-sm hover:text-white transition space-x-1">
					<FiLogOut />
					<span onClick={handleLogout}>Logout</span>
				</button>
			</div>
		</nav>
	)
}

const NavItem = ({ children, to }) => {
	return (
		<NavLink
			className={({ isActive }) =>
				(isActive ? "text-white" : "text-gray-400") +
				" flex items-center text-lg space-x-2 p-2 hover:opacity-80"
			}
			to={to}
		>
			{children}
		</NavLink>
	)
}

export default NavBar
