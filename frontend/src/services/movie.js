import axios from "axios"

async function uploadMovie(formData, onUploadProgress) {
	try {
		// const res = await fetch("/api/movie/trailer", {
		// 	method: "POST",
		// 	body: formData,
		// })

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

export { uploadMovie }