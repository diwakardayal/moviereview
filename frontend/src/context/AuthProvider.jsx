/* eslint-disable react/prop-types */
import { createContext, useState } from "react"
import { useNavigate } from "react-router-dom"

export const AuthContext = createContext()

export default function AuthProvider({ children }) {
	const [user, setUser] = useState(JSON.parse(window.localStorage.getItem("user")) || null)
	const navigate = useNavigate()

	async function setUserInfoHandler(userInfo) {
		setUser(userInfo)
		window.localStorage.setItem("user", JSON.stringify(userInfo))
		return
	}

	function handleLogout() {
		localStorage.removeItem("user")
		navigate("/")
		setUser(null)
	}

	return (
		<AuthContext.Provider value={{ user, setUserInfoHandler, handleLogout }}>
			{children}
		</AuthContext.Provider>
	)
}
