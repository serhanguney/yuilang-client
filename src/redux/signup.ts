import { SIGNUP_REQUESTED, SIGNUP_SUCCESSFUL, SIGNUP_FAILED, SIGNUP_IDLE } from './constants';
import { Dispatch } from 'react';
import { history } from '../index';
import { LOGIN_PAGE_URL, REQUEST_URL } from '../utils/constants';
import { initialiseAddCategoryRequest } from './firebase';
import { languages } from '../utils/fixedValues';

interface IAction {
  type: string;
}

export interface IState {
  signupStatus: string;
}

// Actions
const signupRequested = () => ({ type: SIGNUP_REQUESTED });
const signupSuccessful = () => ({ type: SIGNUP_SUCCESSFUL });
const signupFailed = () => ({ type: SIGNUP_FAILED });

interface ICtx {
  email: string;
  password: string;
}
type TInitialiseSignup = (ctx: ICtx) => void;

export const initialiseSignup: TInitialiseSignup = (ctx) => async (dispatch: Dispatch<IAction>) => {
  dispatch(signupRequested());
  try {
    const { email, password } = ctx;
    const response = await fetch(`${REQUEST_URL}/signUp`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (response.ok) {
      const result = await response.json();
      if (result.user.uid) {
        await initialiseAddCategoryRequest({
          category: 'reading',
          uid: result.user.uid,
          language: languages.czech,
        })(dispatch);
      }
      dispatch(signupSuccessful());
      history.push(`${LOGIN_PAGE_URL}`);
      history.go(0);
    } else {
      dispatch(signupFailed());
    }
  } catch (e) {
    dispatch(signupFailed());
    throw e;
  }
};

const initialState: IState = {
  signupStatus: SIGNUP_IDLE,
};

export const reducer = (state = initialState, action: IAction) => {
  switch (action.type) {
    case SIGNUP_REQUESTED:
      return {
        signupStatus: SIGNUP_REQUESTED,
      };
    case SIGNUP_SUCCESSFUL:
      return {
        signupStatus: SIGNUP_SUCCESSFUL,
      };
    case SIGNUP_FAILED:
      return {
        signupStatus: SIGNUP_FAILED,
      };
    default:
      return state;
  }
};
