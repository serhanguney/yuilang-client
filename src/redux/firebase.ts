import { Dispatch } from 'react';
import { ActionType } from './commons';
import { getUserData } from './content';
import { REQUEST_SUCCESSFUL, REQUEST_INITIALISED, REQUEST_FAILED, REQUEST_IDLE } from './constants';

interface ActionProps {
	type: string;
}

export interface ReducerState {
	status: string;
	message: string;
}
interface PhraseRequestProps {
	uid: string;
	phrase: string;
	language: string;
	category: string;
	type: string;
	inEnglish: string;
}
interface CategoryRequestProps {
	category: string;
	language: string;
	uid: string;
}
export type PhraseRequestType = (context: PhraseRequestProps) => (dispatch: Dispatch<ActionType<any>>) => void;
export type CategoryRequestType = (context: CategoryRequestProps) => (dispatch: Dispatch<ActionType<any>>) => void;

function initialiseRequest() {
	return {
		type: REQUEST_INITIALISED
	};
}
function completeRequest() {
	return {
		type: REQUEST_SUCCESSFUL
	};
}

function failRequest() {
	return {
		type: REQUEST_FAILED
	};
}

//TODO get session and add it to state
export const initialiseAddPhraseRequest: PhraseRequestType = (context) => async (dispatch) => {
	dispatch(initialiseRequest());
	// fetch
	const { uid, phrase } = context;
	if (!uid && !phrase) {
		dispatch(failRequest());
		return;
	}
	try {
		const response = await fetch('/addPhrase', {
			method: 'POST',
			body: JSON.stringify(context)
		});
		if (response.status < 300) {
			await getUserData(uid)(dispatch);
			dispatch(completeRequest());
			console.log(response.body);
		} else {
			dispatch(failRequest());
			console.log(response.body);
		}
	} catch (err) {
		dispatch(failRequest());
		throw new Error(`Request to server failed ${err}`);
	}
};

export const initialiseAddCategoryRequest: CategoryRequestType = (context) => async (dispatch) => {
	dispatch(initialiseRequest());
	const { uid, language, category } = context;
	if (!uid && !language && !category) {
		dispatch(failRequest());
		return;
	}
	try {
		const response = await fetch('/addCategory', {
			method: 'POST',
			body: JSON.stringify(context)
		});
		if (response.status < 300) {
			await getUserData(uid)(dispatch);
			dispatch(completeRequest());
		} else {
			dispatch(failRequest());
		}
	} catch (err) {
		dispatch(failRequest());
		throw new Error(`Request to server failed ${err}`);
	}
};

const initialState = {
	status: REQUEST_IDLE,
	message: ''
};

export function reducer(state: ReducerState = initialState, action: ActionProps) {
	switch (action.type) {
		case REQUEST_INITIALISED:
			return {
				...state
			};
		case REQUEST_SUCCESSFUL:
			return {
				...state,
				status: REQUEST_SUCCESSFUL,
				message: 'Your phrase has been added successfully.'
			};
		case REQUEST_FAILED:
			return {
				...state,
				status: REQUEST_FAILED,
				message: 'Your phrase could not be added.'
			};
		default:
			return state;
	}
}
