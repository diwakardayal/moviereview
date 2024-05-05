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

async function searchActor(actorName) {
	try {
		const res = await axios.get(`/api/actor/actorName/${actorName}`)
		return res?.data
	} catch (e) {
		return { error: e }
	}
}

async function getActors(ids) {
	try {
		const res = await axios.get(`/api/actor/${ids}`)
		return res?.data
	} catch (e) {
		return { error: e }
	}
}

export { createActor, searchActor, getActors }
