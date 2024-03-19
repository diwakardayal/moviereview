import { Route, Routes } from "react-router-dom"
import NavBar from "../admin/NavBar"
import MoviesPage from "../Pages/MoviesPage"
import ActorsPage from "../admin/ActorsPage"
import NotFoundPage from "../Pages/404Page"
import Dashboard from "../admin/Dashboard"

export default function AdminNavigator() {
	return (
		<div className="flex">
			<NavBar />
			<div className="flex-1 p-2 max-w-screen-xl">
				<Routes>
					<Route path="/" element={<Dashboard />} />
					<Route path="/movies" element={<MoviesPage />} />
					<Route path="/actors" element={<ActorsPage />} />
					<Route path="/*" element={<NotFoundPage />} />
				</Routes>
			</div>
		</div>
	)
}
