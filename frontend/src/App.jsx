import NavBar from "./components/NavBar"
import SignInForm from "./components/SignInForm"
import { Routes, Route } from "react-router-dom"
import Home from "./Pages/Home.jsx"
import SignUpForm from "./components/SignUpForm"
import ForgetPassword from "./components/ForgetPasswordForm"
import EmailVerfication from "./admin/EmailVerfication.jsx"
import ConfirmPassword from "./components/ConfirmPassword"
import PrivateRoute from "./components/PrivateRoute.jsx"
import NotFoundPage from "./Pages/404Page.jsx"
import ActorsPage from "./admin/ActorsPage.jsx"
import MoviesPage from "./Pages/MoviesPage.jsx"
import { useAuth } from "./hooks/index.js"
import AdminNavigator from "./navigator/AdminNavigator.jsx"

function App() {
	const { user } = useAuth()

	if (user?.isAdmin) return <AdminNavigator />

	return (
		<>
			<NavBar />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/register" element={<SignUpForm />} />
				<Route path="/setNewPassword" element={<ConfirmPassword />} />
				<Route path="/verifyEmail" element={<EmailVerfication />} />
				<Route path="/login" element={<SignInForm />} />
				<Route path="/forgetPassword" element={<ForgetPassword />} />
				<Route path="" element={<PrivateRoute />}>
					<Route path="/actors" element={<ActorsPage />} />
					<Route path="/movies" element={<MoviesPage />} />
				</Route>
				<Route path="/*" element={<NotFoundPage />} />
			</Routes>
		</>
	)
}

export default App
