import { Dispatch } from 'react';
import { ActionType } from './commons';

const EMPTY = 'empty';
const INFO = 'info';
const ERROR = 'error';
export interface ReducerState {
  type: 'empty' | 'info' | 'error';
  message: string;
}

const promptInfo = (payload: string) => ({ type: INFO, payload });
const promptError = (payload: string) => ({ type: ERROR, payload });

export type PromptInfoModal = (ctx: ReducerState) => (dispatch: Dispatch<ActionType<string>>) => void;
export const promptInfoModal: PromptInfoModal =
  ({ type, message }: ReducerState) =>
  (dispatch: Dispatch<ActionType<string>>) => {
    if (type === INFO) {
      dispatch(promptInfo(message));
    } else {
      dispatch(promptError(message));
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
    default:
      return state;
  }
};
