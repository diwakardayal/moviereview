import axios from "axios"

async function searchDirector(directorName) {
	try {
		const res = await axios.get(`/api/cast/castName/director/${directorName}`)
		return res?.data
	} catch (e) {
		return { error: e }
	}
}

async function getDirectors(ids) {
	try {
		const res = await axios.get(`/api/director/${ids}`)
		return res?.data
	} catch (e) {
		return { error: e }
	}
}
export { searchDirector, getDirectors }
