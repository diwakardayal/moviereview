async function login() {}

async function registerUser(userInfo) {
	try {
		const res = await fetch("/api/users", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(userInfo),
		})

		const data = await res.json()
		console.log("data: ", data)
		return true
	} catch (e) {
		console.log(e)
	}
}

async function verifyEmail(userInfo) {
	try {
		const res = await fetch("/api/users/verifyEmail", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(userInfo),
		})

		const data = await res.json()
		console.log(data)
		return true
	} catch (e) {
		console.log(e)
	}
}

export { login, registerUser, verifyEmail }
