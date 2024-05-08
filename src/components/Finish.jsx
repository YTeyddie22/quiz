import RestartButton from "./RestartButton";

function Finish({ points, maxPoints, highscore, dispatch }) {
	const percentage = (points / maxPoints) * 100;

	return (
		<>
			<p className='result'>
				You scored <strong>{points}</strong> out of {maxPoints}. (
				{Math.ceil(percentage)}%)
			</p>

			<p className='highscore'>(Highscore: {highscore} points)</p>

			{maxPoints && <RestartButton dispatch={dispatch} />}
		</>
	);
}

export default Finish;
