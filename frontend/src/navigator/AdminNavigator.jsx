/* eslint-disable react/prop-types */
import { Route, Routes } from "react-router-dom"
import NavBar from "../admin/NavBar"
import MoviesPage from "../Pages/MoviesPage"
import ActorsPage from "../admin/ActorsPage"
import NotFoundPage from "../Pages/404Page"
import Dashboard from "../admin/Dashboard"
import Header from "../admin/Header"
import UploadMovie from "../admin/UploadMovie"
import { useState } from "react"
import UploadActor from "../admin/UploadActor"

export default function AdminNavigator() {
	const [isMovieFormVisible, SetIsMovieFormVisible] = useState(false)
	const [isActorFormVisible, setIsActorFormVisible] = useState(false)
	return (
		<>
			<div className="flex dark:bg-primary bg-white">
				<NavBar />
				<div className="flex-1 p-2 max-w-screen-xl">
					<Header
						onAddMovieClick={() => SetIsMovieFormVisible(true)}
						onAddActorClick={() => setIsActorFormVisible(true)}
					/>
					<Routes>
						<Route path="/" element={<Dashboard />} />
						<Route path="/movies" element={<MoviesPage />} />
						<Route path="/actors" element={<ActorsPage />} />
						<Route path="/*" element={<NotFoundPage />} />
					</Routes>
				</div>
			</div>
			<UploadMovie
				isMovieFormVisible={isMovieFormVisible}
				onClose={() => SetIsMovieFormVisible(false)}
			/>
			<UploadActor
				isModalVisible={isActorFormVisible}
				onClose={() => setIsActorFormVisible(false)}
			/>
		</>
	)
}
