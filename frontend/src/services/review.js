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

export { getReviews }
