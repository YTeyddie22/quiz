function Start({ questionsLength, dispatch }) {
	return (
		<div className='start'>
			<h2>Welcome to the Rect Quiz</h2>
			<h3>{questionsLength} questions to test your React mastery</h3>
			<button
				className='btn btn-ui'
				onClick={() =>
					dispatch({
						type: "start",
					})
				}>
				Let's start
			</button>
		</div>
	);
}

export default Start;
