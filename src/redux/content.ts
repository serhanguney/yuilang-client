import { ActionType } from './commons';
import { CONTENT_REQUESTED, CONTENT_RECEIVED, CONTENT_FAILED, CONTENT_IDLE } from './constants';
import { Dispatch } from 'react';
import { DatabaseModel } from '../conf/dataModel';

export interface ReducerState {
	userContent: DatabaseModel | {};
	contentStatus: string;
}

const initialState = {
	userContent: {},
	contentStatus: CONTENT_IDLE
};

const requestContent = () => ({ type: CONTENT_REQUESTED });
const receiveContent = (payload: any) => ({ type: CONTENT_RECEIVED, payload });
const failedContent = () => ({ type: CONTENT_FAILED });

export const getUserData = (uid: string) => async (dispatch: Dispatch<ActionType<any>>) => {
	dispatch(requestContent());

	if (!uid) {
		dispatch(failedContent());
		return;
	}
	try {
		const response: any = await fetch('/getSession', {
			method: 'POST',
			body: JSON.stringify({ uid })
		});
		if (response.status < 300) {
			const result = await response.json();
			dispatch(receiveContent(result));
		} else {
			dispatch(failedContent());
		}
	} catch (err) {
		dispatch(failedContent());
		throw new Error(`User data could not be fetched: ${err}`);
	}
};

export function reducer(state: ReducerState = initialState, action: ActionType<any>): ReducerState {
	switch (action.type) {
		case CONTENT_REQUESTED:
			return {
				...state,
				contentStatus: CONTENT_REQUESTED
			};
		case CONTENT_RECEIVED:
			return {
				...state,
				userContent: action.payload,
				contentStatus: CONTENT_RECEIVED
			};
		case CONTENT_FAILED:
			return {
				...state,
				contentStatus: CONTENT_FAILED
			};
		default:
			return state;
	}
}
