import axios from "axios"

class ApiClient {

    constructor(remoteHostUrl) {
        this.remoteHostUrl = remoteHostUrl
        this.token = null
        this.tokenName = "student_store_token"
    }

    setToken(token) {
        this.token = token
        localStorage.setItem(this.tokenName, token)
    }

    async request({ endpoint, method = "GET", data = {} }) {
        const url = `${this.remoteHostUrl}/${endpoint}`

        const headers = {
            "Content-Type": "application/json"
        }

        // if token exists, attach Authorization header
        if (this.token) {
            headers["Authorization"] = `Bearer ${this.token}`
        }

        try {
            const res = await axios({ url, method, data, headers })
            return { data: res.data, error: null}
        } catch(error) {
            console.error( {errorResponse: error.response} )
            const message = error?.response?.data?.error?.message
            return { data: null, error: message || String(error) }
        }
    }

    // LOGIN / REGISTRATION METHODS  =====================================================================

    async login(credentials) {
        // call request method to send http request to auth/login endpoint
        return await this.request({ endpoint:"auth/login", method:'POST', data:credentials })
    }

    async signup(credentials) {
        // call request method to send http request to auth/register endpoint
        return await this.request({ endpoint:"auth/register", method:'POST', data:credentials })
    }

    async fetchUserFromToken() {
        // call request method to send http request to the auth/me endpoint
        return await this.request({ endpoint:"auth/me", method:'GET' })
    }

    // ORDER METHODS  ==================================================================================

    async fetchOrdersForUser() {
        return await this.request({ endpoint:"orders/", method:'GET' })
    }

    async createNewOrder(order) {
        return await this.request({ endpoint:"orders/", method:'POST', data:order })
    }

    // STORE METHODS  ==================================================================================

    async fetchProducts() {
        return await this.request({ endpoint:"store/", method:'GET' })
    }

}

export default new ApiClient(process.env.REACT_APP_REMOTE_HOST_URL || "http://localhost:3001")