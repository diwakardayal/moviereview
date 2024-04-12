import axios from "axios"

async function createActor(userInfo) {
	try {
		const res = await axios.post("/api/actor", userInfo, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		})
		return { actor: res }
	} catch (e) {
		return { error: e?.response?.request?.statusText }
	}
}

export { createActor }
