import { useEffect } from "react"
import { useAuth } from "../hooks"
import { useNavigate } from "react-router-dom"

const PrivateRoute = () => {
	const navigate = useNavigate()
	const { user } = useAuth().authContextValue
	console.log("LOL user", user)
	useEffect(() => {
		if (!user) {
			navigate("/")
		}
	})
}

export default PrivateRoute
