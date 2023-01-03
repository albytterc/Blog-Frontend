import { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import LoginForm from './components/LoginForm';
import blogService from './services/blogs';
import loginService from './services/login';
import BlogForm from './components/BlogForm';
import Togglable from './components/Togglable';

const App = () => {
	const [blogs, setBlogs] = useState([]);
	const [user, setUser] = useState(null);
	const [notification, setNotification] = useState(null);
	const [likeCount, setLikeCount] = useState(0);
	const blogFormRef = useRef(null);
	const blogListRef = useRef(null);


	useEffect(() => {
		const userLoggedIn = window.localStorage.getItem('loggedInUser');
		if (userLoggedIn) {
			const userData = JSON.parse(userLoggedIn);
			setUser(userData);
			loginService.setToken(userData.token);
			blogService.setToken(userData.token);
		}
	}, []);

	useEffect(() => {
		blogService.getAll().then(blogs => {
			setBlogs(blogs);
		});
	}, [likeCount, blogs.length]);

	const notify = (type, message) => {
		setNotification({ type: type, message: message });
		setTimeout(() => {
			setNotification(null);
		}, 5000);
	};

	const handleError = (e) => {
		const errorMessage = e.response.data.error;
		notify('error', errorMessage);
	};

	const handleLogin = async (username, password) => {
		try {
			const user = await loginService.login(username, password);
			loginService.setToken(user.token);
			blogService.setToken(user.token);
			window.localStorage.setItem('loggedInUser', JSON.stringify(user));
			setUser(user);
			notify('success', 'Successfully logged in');
		} catch (e) {
			handleError(e);
		}
	};

	const handleLogout = () => {
		window.localStorage.clear();
		notify('success', 'Successfully logged out');
		setUser(null);
	};

	const handleCreate = async (newBlog) => {
		blogFormRef.current.toggleVisible();
		try {
			const resp = await blogService.create(newBlog);
			setBlogs(blogs.concat(resp));
			notify('success', `Created new blog: ${resp.title}, by ${resp.author}`);
		} catch (e) {
			handleError(e);
		}
	};

	const handleDelete = async (blog) => {
		if (window.confirm('Are you sure you want to delete ' + blog.title + '?')) {
			try {
				await blogService.deletePost(blog);
				setBlogs(blogs.filter(b => b.id !== blog.id));
				notify('success', 'Deleted blog ' + blog.title);
			} catch (e) {
				handleError(e);
			}
		}
	};

	const handleLikes = async (blog) => {
		try {
			await blogService.updateLikes(blog);
			setLikeCount(likeCount + 1);
		} catch (e) {
			handleError(e);
		}
	};

	const notificationStyle = {
		color: notification && notification.type === 'success' ? 'green' : 'red',
		fontWeight: 'bold',
		fontSize: '24px',
		fontFamily: 'sans-serif'
	};

	const toggleListState = () => {
		const map = getMap();
		for (let value of map.values()) {
			value.toggleDetails();
		}
		// setBlogs(prevBlogs => prevBlogs);
	};

	const getMap = () => {
		if (!blogListRef.current) {
			blogListRef.current = new Map();
		}

		return blogListRef.current;
	};


	if (user) {
		return (
			<div>
				<p style={notificationStyle}>{notification && notification.message}</p>
				<h1>Blogs</h1>
				<div>
					<b>Logged in as {user.name}&nbsp;</b>
					<button onClick={handleLogout} type="button">Logout</button>
					<Togglable toggle="New Post" ref={blogFormRef}>
						<BlogForm submitHandler={handleCreate}/>
					</Togglable>
					<p></p>
				</div>

				<p></p>
				<div>
					<button type="button" onClick={toggleListState}>Toggle All</button>
					<p></p>
					{blogs.sort((a, b) => b.likes - a.likes).map(blog => (
						<Blog
							key={blog.id}
							blog={blog}
							likeHandler={handleLikes}
							deleteHandler={handleDelete}
							ref={node => {
								const map = getMap();
								if (node) {
									map.set(blog.id, node);
								} else {
									map.delete(blog.id);
								}
							}}
						/>
					))}
				</div>
			</div>
		);
	} else {
		return (
			<>
				<p style={notificationStyle}>{notification && notification.message}</p>
				<h1>Blogs</h1>
				<LoginForm submitHandler={handleLogin}/>
			</>
		);
	}
};


export default App;