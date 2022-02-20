import { Dispatch } from 'react';
import { ActionType } from './commons';
import { IDENTITY_REQUESTED, IDENTITY_RECEIVED, IDENTITY_FAILED, IDENTITY_IDLE } from './constants';
import { history } from '../index';
import { getUserData } from './content';
import { HOME_PAGE_URL } from '../utils/constants';

export type Identity = {
	uid: string;
	identityStatus: string;
	language: 'cs';
};

interface LoginProps {
	email: string;
	password: string;
}
// Action creators
const requestIdentity = () => ({ type: IDENTITY_REQUESTED });
const receiveIdentity = (payload: string) => ({ type: IDENTITY_RECEIVED, payload: payload });
const failedIdentity = () => ({ type: IDENTITY_FAILED });

const requestLogin = () => ({ type: IDENTITY_REQUESTED });
const completeLogin = (payload: string) => ({ type: IDENTITY_RECEIVED, payload: payload });
const failLogin = () => ({ type: IDENTITY_FAILED });

// Actions
export const initialiseLogin = (context: LoginProps) => async (dispatch: Dispatch<ActionType<string>>) => {
	const { email, password } = context;
	if (!email || !password) {
		dispatch(failLogin());
		console.error('either email or password is missing:', email, password);
		return;
	}
	try {
		dispatch(requestLogin());

		const response = await fetch('/login', {
			method: 'POST',
			body: JSON.stringify({ email, password })
		});
		if (response.status < 300) {
			const result = await response.json();
			await getUserData(result.user.uid)(dispatch);
			dispatch(completeLogin(result.user.uid));
			history.push(`${HOME_PAGE_URL}`);
			history.go(0);
		} else {
			dispatch(failLogin());
		}
	} catch (err) {
		dispatch(failedIdentity());
		throw new Error(`Request failed: ${err}`);
	}
};

export const retrieveIdentity = () => async (dispatch: Dispatch<ActionType<string>>) => {
	dispatch(requestIdentity());
	try {
		const response = await fetch('/getIdentity', {
			method: 'GET'
		});
		if (response.status < 300) {
			const result = await response.text();
			dispatch(receiveIdentity(result));
		} else {
			dispatch(failedIdentity());
		}
	} catch (err) {
		dispatch(failedIdentity());
		throw new Error(`Error occurred trying to get user data: ${err}`);
	}
};

const initialState = {
	uid: '',
	identityStatus: IDENTITY_IDLE,
	language: 'cs' as 'cs'
};

export function reducer(state: Identity = initialState, action: ActionType<string>): Identity {
	switch (action.type) {
		case IDENTITY_REQUESTED:
			return {
				...state,
				identityStatus: IDENTITY_REQUESTED
			};
		case IDENTITY_RECEIVED:
			return {
				...state,
				uid: action.payload!,
				identityStatus: IDENTITY_RECEIVED
			};
		case IDENTITY_FAILED:
			return {
				...state,
				uid: '',
				identityStatus: IDENTITY_FAILED
			};
		default:
			return state;
	}
}
