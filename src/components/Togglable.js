import { forwardRef, useImperativeHandle, useState } from 'react';
import PropTypes from 'prop-types';

const Togglable = forwardRef((props, refs) => {
	const [visible, setVisible] = useState(false);

	const hideWhenVisible = {display: visible ? 'none' : 'inline'};
	const showWhenVisible = {display: visible ? '' : 'none'};

	const toggleVisible = () => {
		setVisible(!visible);
	};

	useImperativeHandle(refs, () => {
		return {toggleVisible};
	});

	return (
		<>
			<div style={hideWhenVisible}>
				<button type="button" onClick={toggleVisible}>{props.toggle}</button>
			</div>
			<div style={showWhenVisible}>
				{props.children}
				<button type="button" onClick={toggleVisible}>Cancel</button>
			</div>
		</>
	);
});

Togglable.propTypes = {
	toggle: PropTypes.string.isRequired
};

Togglable.displayName = 'Togglable';
export default Togglable;