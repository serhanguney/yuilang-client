import { Dispatch } from 'react';
import { ActionType } from './commons';

const EMPTY = 'empty';
const INFO = 'info';
const ERROR = 'error';
const SUCCESS = 'success';

export interface ReducerState {
  type: 'empty' | 'info' | 'error' | 'success';
  message: string;
}

const promptInfo = (payload: string) => ({ type: INFO, payload });
const promptError = (payload: string) => ({ type: ERROR, payload });
const promptSuccess = (payload: string) => ({ type: SUCCESS, payload });
const resetModal = () => ({ type: EMPTY });

export type PromptInfoModal = (ctx: ReducerState) => (dispatch: Dispatch<ActionType<string>>) => void;
export const promptInfoModal: PromptInfoModal =
  ({ type, message }: ReducerState) =>
  (dispatch: Dispatch<ActionType<string>>) => {
    if (type === INFO) {
      dispatch(promptInfo(message));
    } else if (type === ERROR) {
      dispatch(promptError(message));
    } else if (type === SUCCESS) {
      dispatch(promptSuccess(message));
    } else {
      dispatch(resetModal());
    }
  };

const initialState: ReducerState = {
  type: EMPTY,
  message: '',
};
export const reducer = (state: ReducerState = initialState, action: ActionType<string>): ReducerState => {
  switch (action.type) {
    case INFO:
      return {
        type: INFO,
        message: action.payload!,
      };
    case ERROR:
      return {
        type: ERROR,
        message: action.payload!,
      };
    case SUCCESS:
      return {
        type: SUCCESS,
        message: action.payload!,
      };
    case EMPTY:
      return {
        type: EMPTY,
        message: '',
      };
    default:
      return state;
  }
};
