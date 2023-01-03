import { useState } from 'react';
import '../assets/styles.css';

const LoginForm = ({ submitHandler }) => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const loginUser = (event) => {
		event.preventDefault();

		submitHandler(username, password);

		setUsername('');
		setPassword('');
	};

	return (
		<form className="login-form" onSubmit={loginUser}>
			<div>
				<label htmlFor="username">Username: </label>
				<input required value={username} onChange={({ target }) => setUsername(target.value)} name="username" id="username" type="text"/>
			</div>
			<div>
				<label htmlFor="password">Password: </label>
				<input required value={password} onChange={({ target }) => setPassword(target.value)} name="password" id="password" type="password"/>
			</div>
			<button type="submit">Login</button>
		</form>
	);
};

export default LoginForm;