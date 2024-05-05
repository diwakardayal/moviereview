/* eslint-disable react/prop-types */
import { BsTrash, BsPencilSquare, BsBoxArrowUpRight } from "react-icons/bs"
import ModalComponent from "./modal/ModalContainer"
import { useNotification } from "../hooks"
import { useState } from "react"
import ConfirmModal from "./modal/ConfirmModal"
import MovieForm from "../admin/MovieForm"
import { getMovieById, deleteMovie } from "../services/movie"

export default function RecentUploads({ movies = [], refresh }) {
	const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false)
	const [isMovieFormVisible, setIsMovieFormVisible] = useState(false)
	const [busy, setBusy] = useState(false)
	const [movieId, setMovieId] = useState("")
	const [movie, setMovie] = useState({
		title: "",
		storyLine: "",
		tags: [],
		actors: [],
		director: {},
		writers: [],
		releaseDate: "",
		poster: null,
		genres: [],
		type: "",
		language: "",
		status: "",
		trailer: {
			url: "",
			public_id: "",
		},
	})

	const { updateNotification } = useNotification()

	async function handleDeleteBtn() {
		setBusy(true)

		const { success, error } = await deleteMovie(movieId)

		if (error) {
			updateNotification("error", error)
		}

		if (success) {
			updateNotification("success", success)
		}

		setIsConfirmModalVisible(false)
		setBusy(false)
		refresh()
	}

	function handleConfirmModalVisibilty(movieId) {
		setIsConfirmModalVisible(value => !value)
		setMovieId(movieId)
	}

	async function fetchMovie(movieId) {
		const res = await getMovieById(movieId)
		if (res.error) {
			updateNotification("error", "Failed to get Movie")
			return
		}

		return res.res
	}

	async function handleEditBtn(id) {
		setIsMovieFormVisible(true)
		const res = await fetchMovie(id)

		setMovieId(id)
		setMovie(res)
		refresh()
	}

	return (
		<>
			<div className="col-span-3 shadow dark:shadow dark:bg-secondary p-5 rounded">
				<h2 className="font-semibold text-2xl mb-2 text-primary dark:text-white">
					Recent Uploads
				</h2>
				{movies.length > 0 &&
					movies.map((movie, index) => (
						<div key={index}>
							<div className="flex items-center justify-between">
								<div className="flex gap-3 dark:text-white text-primary mt-4">
									<img src={movie.poster.url} alt={movie.title} width={100} />
									<div>
										<p className="text-lg">{movie.title}</p>
										<p className="text-sm text-gray-300 capitalize">
											{movie.tags.join(" ")}
										</p>
									</div>
								</div>

								<div className="flex gap-4 items-center">
									<p className="dark:text-white text-primary">{movie.status}</p>
									<div className="flex dark:text-white text-primary gap-2">
										<BsTrash
											className="cursor-pointer"
											onClick={() => handleConfirmModalVisibilty(movie._id)}
										/>{" "}
										<BsPencilSquare
											className="cursor-pointer"
											onClick={() => handleEditBtn(movie._id)}
										/>{" "}
										<BsBoxArrowUpRight className="cursor-pointer" />
									</div>
								</div>
							</div>
							<hr />
						</div>
					))}
			</div>
			<ConfirmModal
				isModalVisible={isConfirmModalVisible}
				title="Are you sure?"
				subtitle="This action will remove this movie permanently!"
				busy={busy}
				onCancel={handleConfirmModalVisibilty}
				onConfirm={handleDeleteBtn}
			/>
			{isMovieFormVisible && movie?.title?.length > 0 && (
				<ModalComponent isModalVisible={true} onClose={() => setIsMovieFormVisible(false)}>
					<MovieForm
						isMovieFormVisible={isMovieFormVisible}
						onClose={() => setIsMovieFormVisible(false)}
						initialFormData={movie}
						movieId={movieId}
					/>
				</ModalComponent>
			)}
		</>
	)
}
