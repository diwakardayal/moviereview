import axios from "axios"

async function uploadTrailer(formData, onUploadProgress) {
	try {
		const { data } = await axios.post("/api/movie/trailer", formData, {
			onUploadProgress: ({ loaded, total }) => {
				if (onUploadProgress) onUploadProgress(Math.floor((loaded / total) * 100))
			},
		})

		return data
	} catch (e) {
		console.log(e)
	}
}

async function uploadMovie(movieInfo) {
	try {
		const data = await axios.post("/api/movie/create", movieInfo, {
			headers: {
				"content-type": "multipart/form-data",
			},
		})
		console.log(data)
		return data
	} catch (e) {
		console.log(e)
		return { error: e }
	}
}

async function getMovies() {
	try {
		const res = await axios.get("/api/movie/")

		return { movies: res.data.movies }
	} catch (e) {
		return { error: e.response.data.message }
	}
}

async function getMovieById(movieId) {
	try {
		const res = await axios.get(`/api/movie/getMovieById/${movieId}`)

		return { res: res.data }
	} catch (e) {
		return { error: e }
	}
}

async function updateMovie(movieId, movieInfo) {
	try {
		const res = await axios.put(`/api/movie/update/${movieId}`, movieInfo, {
			headers: {
				"content-type": "multipart/form-data",
			},
		})

		return { res: res.data }
	} catch (e) {
		return { error: e }
	}
}

async function deleteMovie(movieId) {
	try {
		const res = await axios.delete(`/api/movie/${movieId}`)

		return { success: res?.data?.message }
	} catch (e) {
		return { error: e?.response?.request?.statusText }
	}
}

async function getLatestUploads() {
	try {
		const res = await axios.get(`/api/movie/latest/5`)

		return { movies: res?.data.movies }
	} catch (e) {
		console.log(e)
		return { error: e?.response?.request?.statusText }
	}
}

async function getTopRatedMovies(type) {
	try {
		let endpoint = "/api/movie/top-rated"
		if (type) endpoint = endpoint + "?type=" + type

		const res = await axios.get(endpoint)
		console.log("res  ", res)

		return { movies: res?.data.movies }
	} catch (e) {
		console.log(e)
		return { error: e?.response?.request?.statusText }
	}
}

export {
	uploadTrailer,
	uploadMovie,
	getMovies,
	getMovieById,
	updateMovie,
	deleteMovie,
	getLatestUploads,
	getTopRatedMovies,
}
