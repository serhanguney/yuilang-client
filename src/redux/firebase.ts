import { Dispatch } from 'react';
import { ActionType } from './commons';
import { getUserData } from './content';
import { REQUEST_SUCCESSFUL, REQUEST_INITIALISED, REQUEST_FAILED, REQUEST_IDLE } from './constants';
import { REQUEST_URL } from '../utils/constants';
import { promptInfoModal } from './infoModal';

interface ActionProps {
  type: string;
}

export interface ReducerState {
  status: string;
  message: string;
}
export interface BaseProps {
  uid: string;
  language: string;
  category: string;
}
interface PhraseRequestProps extends BaseProps {
  phrase: string;
  type: string;
  inEnglish: string;
  categoryCount: number;
}

export interface DeleteRequestProps extends BaseProps {
  phraseID: string;
}
export type PhraseRequestType = (context: PhraseRequestProps) => (dispatch: Dispatch<ActionType<any>>) => void;
export type CategoryRequestType = (context: BaseProps) => (dispatch: Dispatch<ActionType<any>>) => void;
export type DeleteRequestType = (context: DeleteRequestProps) => (dispatch: Dispatch<ActionType<any>>) => void;

function initialiseRequest() {
  return {
    type: REQUEST_INITIALISED,
  };
}
function completeRequest() {
  return {
    type: REQUEST_SUCCESSFUL,
  };
}

function failRequest() {
  return {
    type: REQUEST_FAILED,
  };
}

export const initialiseAddPhraseRequest: PhraseRequestType = (context) => async (dispatch) => {
  dispatch(initialiseRequest());
  // fetch
  const { uid, phrase } = context;
  if (!uid && !phrase) {
    dispatch(failRequest());
    return;
  }
  try {
    const response = await fetch(`${REQUEST_URL}/addPhrase`, {
      method: 'POST',
      body: JSON.stringify(context),
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
    const response = await fetch(`${REQUEST_URL}/addCategory`, {
      method: 'POST',
      body: JSON.stringify(context),
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

export const initialiseDeleteRequest: DeleteRequestType = (context) => async (dispatch) => {
  dispatch(initialiseRequest());

  const { uid, language, category, phraseID } = context;
  if (!uid || !language || !category || !phraseID) {
    return dispatch(failRequest());
  }
  try {
    const response = await fetch(`${REQUEST_URL}/delete`, {
      method: 'POST',
      body: JSON.stringify(context),
    });
    if (response.status < 300) {
      console.log('@ getting user data');
      await getUserData(uid)(dispatch);
      dispatch(completeRequest());
      promptInfoModal({ type: 'success', message: 'successfully deleted' })(dispatch);
    } else {
      promptInfoModal({ type: 'error', message: 'failed to delete' })(dispatch);
      dispatch(failRequest());
    }
  } catch (err) {
    dispatch(failRequest());
    promptInfoModal({ type: 'error', message: 'failed to delete' })(dispatch);
    throw new Error(`Request to server failed with: ${err}`);
  }
};
const initialState = {
  status: REQUEST_IDLE,
  message: '',
};

export function reducer(state: ReducerState = initialState, action: ActionProps) {
  switch (action.type) {
    case REQUEST_INITIALISED:
      return {
        ...state,
      };
    case REQUEST_SUCCESSFUL:
      return {
        ...state,
        status: REQUEST_SUCCESSFUL,
        message: 'Your request has been successful.',
      };
    case REQUEST_FAILED:
      return {
        ...state,
        status: REQUEST_FAILED,
        message: 'Your request has failed.',
      };
    default:
      return state;
  }
}
