import { forwardRef, useState, useImperativeHandle } from 'react';

const Blog = forwardRef((props, refs) => {
	const [showDetails, setShowDetails] = useState(false);
	const toggleDetails = () => setShowDetails(!showDetails);

	const blogStyle = {
		paddingTop: 10,
		paddingLeft: 2,
		border: 'solid',
		borderWidth: 1,
		marginBottom: 5,
		marginLeft: 10,
		listStyle: 'none'
	};

	const increaseLikes = async () => {
		const newBlog = { ...props.blog, likes: props.blog.likes + 1 };
		props.likeHandler(newBlog);
	};

	const handleDelete = () => {
		props.deleteHandler(props.blog);
	};


	useImperativeHandle(refs, () => {
		return { toggleDetails };
	});

	return (
		<div className="blogpost" style={blogStyle}>
			<div style={{
				width: 500,
				overflow: 'hidden'
			}}>
				<p style={{ display: 'inline' }}>{props.blog.title}, by {props.blog.author}&nbsp;</p>
				<button
					style={{ float: 'right' }}
					type="button"
					onClick={toggleDetails}
					name="toggleDetails"
				>
					{showDetails ? 'Hide' : 'View'}
				</button>

				{showDetails &&
					<ul style={{ listStyle: 'none', margin: 0, paddingLeft: 10 }}>
						<li>{props.blog.url}</li>
						<li>Likes: {props.blog.likes} </li>
						<button name="likeBtn" type="button" onClick={increaseLikes}>Like</button>
						<button name="deleteBtn" type="button" onClick={handleDelete}>Delete</button>
					</ul>
				}
			</div>
		</div>
	);
});

Blog.displayName = 'Blog';
export default Blog;