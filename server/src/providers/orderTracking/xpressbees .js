import axios from "axios";
import config from "../../config/config.js";

const xpressbees = axios.create({
    baseURL: config.xpressbees.baseUrl,
    headers: { "Content-Type": "application/json" },
});

export default xpressbees;