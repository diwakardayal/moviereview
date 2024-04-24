import axios from "axios"

async function createCast(userInfo) {
	try {
		const res = await axios.post("/api/cast", userInfo, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		})
		return { actor: res }
	} catch (e) {
		return { error: e?.response?.request?.statusText }
	}
}

export { createCast }
