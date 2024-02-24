import { createContext, useEffect } from "react"

export const ThemeContext = createContext()

// eslint-disable-next-line react/prop-types
export default function ThemeProvider({ children }) {
	const toggleTheme = () => {
		const theme = localStorage.getItem("theme")

		if (theme === "light") {
			localStorage.setItem("theme", "dark")
			document.documentElement.classList.remove("light")
			document.documentElement.classList.add("dark")
		} else {
			localStorage.setItem("theme", "light")
			document.documentElement.classList.remove("dark")
			document.documentElement.classList.add("light")
		}
	}

	useEffect(() => {
		const theme = localStorage.getItem("theme")
		if (!theme) document.documentElement.classList.add("light")
		else document.documentElement.classList.add(theme)
	}, [])

	return <ThemeContext.Provider value={{ toggleTheme }}>{children}</ThemeContext.Provider>
}
