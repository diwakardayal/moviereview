import axios from "axios"

async function getUsers() {
	try {
		const users = await axios.get("/api/users")
		return { users: users.data.users }
	} catch (e) {
		return { error: e?.response?.request?.statusText }
	}
}

export { getUsers }
