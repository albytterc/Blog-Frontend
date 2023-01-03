import axios from 'axios';

const baseUrl = '/api/blogs';
let token;

const setToken = (newToken) => {
	token = `bearer ${newToken}`;
};

const getAll = async () => {
	const { data } = await axios.get(baseUrl);
	return data;
};

const create = async (blog) => {
	const config = {
		headers: { Authorization: token }
	};

	const { data } = await axios.post(baseUrl, blog, config);
	return data;
};

const updateLikes = async (blog) => {
	const config = {
		headers: { Authorization: token }
	};

	const updatedBlog = {
		user: blog.user._id,
		likes: blog.likes,
		author: blog.author,
		title: blog.title,
		url: blog.url
	};
	const { data } = await axios.put(baseUrl + '/' + blog.id, updatedBlog, config);
	return data;
};

const deletePost = async (blog) => {
	const config = {
		headers: { Authorization: token }
	};

	const { data } = await axios.delete(baseUrl + '/' + blog.id, config);
	return data;
};

export default { getAll, create, setToken, updateLikes, deletePost };