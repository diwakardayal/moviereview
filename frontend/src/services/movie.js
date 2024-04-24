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

export { uploadTrailer, uploadMovie }
