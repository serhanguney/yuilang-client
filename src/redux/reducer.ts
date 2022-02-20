import { combineReducers } from 'redux';
import { reducer as retrieveIdentity, Identity } from './identity';
import { reducer as phraseRequest, ReducerState as RequestState } from './firebase';
import { reducer as content, ReducerState as ContentState } from './content';
import { reducer as modal, ReducerState as ModalState, TriggerType } from './modal';
import { reducer as exercise } from './practice';
import {reducer as signupState, IState as ISignupState} from './signup';

export type RootState = {
	user: Identity;
	request: RequestState;
	content: ContentState;
	modal: ModalState<TriggerType>;
	exercise: any;
	signupState: ISignupState
};
export const rootReducer = combineReducers({
	user: retrieveIdentity,
	request: phraseRequest,
	content,
	modal,
	exercise,
	signupState
});
