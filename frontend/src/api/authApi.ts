import client from "./client"

export const login = async (credentials: BodyInit) => {
    const {data} = await client.post('/auth/login', credentials)
    return data
}