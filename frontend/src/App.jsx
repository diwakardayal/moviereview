import NavBar from "./components/NavBar"
import SignInForm from "./components/SignInForm"
import { Routes, Route } from "react-router-dom"
import Home from "./Pages/Home"
import SignUpForm from "./components/SignUpForm"
import ForgetPassword from "./components/ForgetPasswordForm"
import EmailVerfication from "./Pages/EmailVerfication"
import ConfirmPassword from "./components/ConfirmPassword"

function App() {
	return (
		<>
			<NavBar />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/login" element={<SignInForm />} />
				<Route path="/register" element={<SignUpForm />} />
				<Route path="/forgetPassword" element={<ForgetPassword />} />
				<Route path="/verifyEmail" element={<EmailVerfication />} />
				<Route path="/setNewPassword" element={<ConfirmPassword />} />
			</Routes>
		</>
	)
}

export default App
