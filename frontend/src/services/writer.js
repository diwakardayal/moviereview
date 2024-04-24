import axios from "axios"

async function searchWriter(writerName) {
	try {
		const res = await axios.get(`/api/cast/castName/writer/${writerName}`)
		return res?.data
	} catch (e) {
		return { error: e }
	}
}
export { searchWriter }
