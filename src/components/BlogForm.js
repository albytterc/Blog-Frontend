import { useState } from 'react';
import '../assets/styles.css';
const BlogForm = ({ submitHandler }) => {
	const [newBlogTitle, setNewBlogTitle] = useState('');
	const [newBlogAuthor, setNewBlogAuthor] = useState('');
	const [newBlogUrl, setNewBlogUrl] = useState('');

	const createBlog = (event) => {
		event.preventDefault();

		const newBlog = {
			title: newBlogTitle,
			author: newBlogAuthor,
			url: newBlogUrl
		};

		submitHandler(newBlog);

		setNewBlogTitle('');
		setNewBlogAuthor('');
		setNewBlogUrl('');
	};

	return (
		<form className="blog-form" onSubmit={createBlog}>
			<h2>Create New Post</h2>
			<div>
				<div>
					<label htmlFor="title">Title: </label>
					<input required value={newBlogTitle} onChange={({ target }) => setNewBlogTitle(target.value)} name="title" id="title" type="text"/>
				</div>
				<div>
					<label htmlFor="author">Author: </label>
					<input required value={newBlogAuthor} onChange={({ target }) => setNewBlogAuthor(target.value)} name="author" id="author" type="text"/>
				</div>
				<div>
					<label htmlFor="url">Url: </label>
					<input required value={newBlogUrl} onChange={({ target }) => setNewBlogUrl(target.value)} name="url" id="url" type="url"/>
				</div>
			</div>
			<button name="create" type="submit">Create</button>
		</form>
	);
};

export default BlogForm;
