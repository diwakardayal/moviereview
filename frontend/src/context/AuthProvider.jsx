/* eslint-disable react/prop-types */
import { createContext, useState } from "react"
import { login } from "../services/auth"

export const AuthContext = createContext()

export default function AuthProvider({ children }) {
	const [user, setUser] = useState(window.localStorage.getItem("user") || null)

	async function setUserInfoHandler({ email, password }) {
		const userInfo = await login({ email, password })

		if (userInfo) {
			setUser(userInfo)
			window.localStorage.setItem("user", JSON.stringify(userInfo))
			return
		}
	}

	const authContextValue = {
		user,
		setUserInfoHandler,
	}

	return <AuthContext.Provider value={{ authContextValue }}>{children}</AuthContext.Provider>
}
