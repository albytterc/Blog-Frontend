import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from '../components/Blog';
import BlogForm from '../components/BlogForm';

describe('direct rendering with mock rendering fn', () => {

	test('renders name and author, without url or likes', () => {
		const blog = {
			title: 'New blog hey hey',
			author: 'Albert',
			url: 'http://testurl.com',
			likes: 0
		};

		render(<Blog blog={blog}/>);

		const elem = screen.getByText('New blog hey hey, by Albert');
		expect(elem).toBeDefined();

		const url = screen.queryByText('http://testurl.com');
		expect(url).toBeNull();

		const likes = screen.queryByText('Likes: 0');
		expect(likes).toBeNull();
	});

	test('shows url and likes on showing details', async () => {
		const user = userEvent.setup();
		const blog = {
			title: 'New blog hey hey',
			author: 'Albert',
			url: 'http://testurl.com',
			likes: 0
		};


		const {container} = render(<Blog blog={blog}/>);
		const button = container.querySelector('button[name="toggleDetails"]');
		await user.click(button);
		screen.debug();

		const url = screen.getByText('http://testurl.com');
		expect(url).toBeDefined();

		const likes = screen.getByText('Likes: 0');
		expect(likes).toBeDefined();
	});

	test('likes are updated twice if button is pressed twice', async () => {
		const user = userEvent.setup();
		const blog = {
			title: 'New blog hey hey',
			author: 'Albert',
			url: 'http://testurl.com',
			likes: 0
		};

		const mockLikeHandler = jest.fn();

		const {container} = render(<Blog blog={blog} likeHandler={mockLikeHandler}/>);
		const showDetails = container.querySelector('button[name="toggleDetails"]');
		await user.click(showDetails);

		const likeBtn = container.querySelector('button[name="likeBtn"]');
		await user.click(likeBtn);
		await user.click(likeBtn);
		screen.debug();
		expect(mockLikeHandler).toBeCalledTimes(2);
	});
});

describe('testing blog creation form', () => {
	test('form calls event handler with passed in details', async () => {
		const user = userEvent.setup();

		const mockCreateBlog = jest.fn();
		const {container} = render(<BlogForm submitHandler={mockCreateBlog} />);

		const titleField = container.querySelector('input#title');
		const authorField = container.querySelector('input#author');
		const urlField = container.querySelector('input#url');
		const submitBtn = container.querySelector('button[name="create"]');

		await user.type(titleField, 'Happy New Year!!');
		await user.type(authorField, 'Albert J. Terc');
		await user.type(urlField, 'http://newyear2023.com');
		await user.click(submitBtn);

		expect(mockCreateBlog.mock.lastCall[0].title).toBe('Happy New Year!!');
		expect(mockCreateBlog.mock.lastCall[0].author).toBe('Albert J. Terc');
		expect(mockCreateBlog.mock.lastCall[0].url).toBe('http://newyear2023.com');
	});
});