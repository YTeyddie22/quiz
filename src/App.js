import { useEffect, useReducer } from "react";
import Header from "./components/Header";
import Main from "./components/Main";
import Loader from "./components/Loader";
import Error from "./components/Error";
import Start from "./components/Start";
import Questions from "./components/Questions";
import NextButton from "./components/NextButton";
import Progress from "./components/Progress";
import Finish from "./components/Finish";
import Footer from "./components/Footer";
import Timer from "./components/Timer";

const SECS_PER_QUESTION = 30;
// Status can be "loading",,"recieved", "error", "active", "done"
const initialState = {
	questions: [],
	status: "loading",
	index: 0,
	answer: null,
	points: 0,
	highscore: 0,
	secondsRemaining: null,
};

function reducer(state, action) {
	switch (action.type) {
		case "dataRecieved":
			return {
				...state,
				questions: action.payload,
				status: "ready",
			};
		case "dataFailed":
			return {
				...state,
				status: "error",
			};

		case "start":
			return {
				...state,
				status: "active",
				secondsRemaining: state.questions.length * SECS_PER_QUESTION,
			};
		case "newAnswer":
			const question = state.questions.at(state.index);

			return {
				...state,
				answer: action.payload,
				points:
					action.payload === question.correctOption
						? state.points + question.points
						: state.points,
			};

		case "newQuestion":
			return {
				...state,
				index: state.index + 1,
				answer: null,
			};

		case "finish":
			return {
				...state,
				status: "finished",
				highscore:
					state.points > state.highscore
						? state.points
						: state.highscore,
			};
		case "restart":
			return {
				...initialState,
				questions: state.questions,
				status: "ready",
			};

		case "tick":
			return {
				...state,
				secondsRemaining: state.secondsRemaining - 1,
				status:
					state.secondsRemaining === 0 ? "finished" : state.status,
			};

		default:
			throw new Error("Action unknown");
	}
}

function App() {
	const [
		{
			questions,
			status,
			index,
			answer,
			points,
			highscore,
			secondsRemaining,
		},
		dispatch,
	] = useReducer(reducer, initialState);

	const questionsLength = questions.length;
	const maxPoints = questions.reduce((acc, cur) => acc + cur.points, 0);

	useEffect(function () {
		async function dataFetcher() {
			try {
				const result = await fetch("http://localhost:8000/questions");
				const data = await result.json();

				dispatch({ type: "dataRecieved", payload: data });
			} catch (error) {
				dispatch({ type: "dataFailed" });
			}
		}

		dataFetcher();
	}, []);
	return (
		<div className='app'>
			<Header />
			<Main>
				{status === "loading" && <Loader />}
				{status === "error" && <Error />}
				{status === "ready" && (
					<Start
						questionsLength={questionsLength}
						dispatch={dispatch}
					/>
				)}
				{status === "active" && (
					<>
						<Progress
							questionsLength={questionsLength}
							index={index}
							points={points}
							maxPoints={maxPoints}
							answer={answer}
						/>
						<Questions
							question={questions[index]}
							answer={answer}
							dispatch={dispatch}
						/>
						<Footer>
							<Timer
								dispatch={dispatch}
								secondsRemaining={secondsRemaining}
							/>
							<NextButton
								dispatch={dispatch}
								answer={answer}
								index={index}
								questionsLength={questionsLength}
							/>
						</Footer>
					</>
				)}
				{status === "finished" && (
					<Finish
						points={points}
						maxPoints={maxPoints}
						questionsLength={questionsLength}
						index={index}
						highscore={highscore}
						dispatch={dispatch}
					/>
				)}
			</Main>
		</div>
	);
}

export default App;
