import NavBar from "./components/NavBar"
import SignInForm from "./components/SignInForm"
import { Routes, Route } from "react-router-dom"
import Home from "./Pages/Home"
import SignUpForm from "./components/SignUpForm"
import ForgetPassword from "./components/ForgetPasswordForm"

function App() {
	return (
		<>
			<NavBar />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/login" element={<SignInForm />} />
				<Route path="/register" element={<SignUpForm />} />
				<Route path="/forgetPassword" element={<ForgetPassword />} />
			</Routes>
		</>
	)
}

export default App
