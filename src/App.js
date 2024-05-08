import { useEffect, useReducer } from "react";
import Header from "./components/Header";
import Main from "./components/Main";
import Loader from "./components/Loader";
import Error from "./components/Error";
import Start from "./components/Start";
import Questions from "./components/Questions";
import NextButton from "./components/NextButton";
import Progress from "./components/Progress";

// Status can be "loading",,"recieved", "error", "active", "done"
const initialState = {
	questions: [],
	status: "loading",
	index: 0,
	answer: null,
	points: 0,
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

		default:
			throw new Error("Action unknown");
	}
}

function App() {
	const [{ questions, status, index, answer, points }, dispatch] = useReducer(
		reducer,
		initialState
	);

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
						<NextButton dispatch={dispatch} answer={answer} />
					</>
				)}
			</Main>
		</div>
	);
}

export default App;
