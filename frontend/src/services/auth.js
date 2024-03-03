async function login(userInfo) {
	const res = await fetch("/api/users/auth", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(userInfo),
	})

	if (!res.ok) {
		throw new Error(`Failed to authenticate. ${res.status}`)
	}

	return await res.json()
}

async function registerUser(userInfo) {
	const res = await fetch("/api/users", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(userInfo),
	})

	if (!res.ok) {
		throw new Error(`Something went wrong: ${res.status}`)
	}

	return await res.json()
}

async function verifyEmail(userInfo) {
	const res = await fetch("/api/users/verifyEmail", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(userInfo),
	})

	if (!res.ok) {
		throw new Error(`Something went wrong: ${res.status}`)
	}

	return await res.json()
}

export { login, registerUser, verifyEmail }
