import axios from "axios"

async function getReviews() {
	try {
		const { data } = await axios.get("/api/review")

		return { reviews: data.reviews }
	} catch (e) {
		console.log(e)
		return { error: e }
	}
}

async function addReview(movieId, review) {
	try {
		const res = await axios.post(`/api/review/`, { ...review, movieId })

		console.log("res ", res)
		return { review: res.data }
	} catch (e) {
		console.log(e)
		return { error: e?.response?.data?.message }
	}
}

export { getReviews, addReview }
