import { useEffect, useReducer } from "react";
import Header from "./components/Header";
import Main from "./components/Main";
import Loader from "./components/Loader";
import Error from "./components/Error";
import Start from "./components/Start";
import Questions from "./components/Questions";

// Status can be "loading",,"recieved", "error", "active", "done"
const initialState = {
	questions: [],
	status: "loading",
	index: 0,
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
		default:
			throw new Error("Action unknown");
	}
}

function App() {
	const [{ questions, status, index }, dispatch] = useReducer(
		reducer,
		initialState
	);

	const questionsLength = questions.length;

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
					<Questions question={questions[index]} />
				)}
			</Main>
		</div>
	);
}

export default App;
