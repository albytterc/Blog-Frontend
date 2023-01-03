import axios from 'axios';

const baseUrl = '/api/login';
let token;

const setToken = (newToken) => {
	token = `bearer ${newToken}`;
};

const login = async (username, password) => {
	const config = {
		headers: { Authorization: token }
	};
	const { data } = await axios.post(baseUrl, { username, password }, config);
	return data;
};

export default { login, setToken, token };