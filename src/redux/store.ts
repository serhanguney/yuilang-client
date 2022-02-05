import { applyMiddleware, compose, createStore } from 'redux';
import { rootReducer } from './reducer';
import thunk from 'redux-thunk';

// @ts-ignore
const composedEnhancer = window.__REDUX_DEVTOOLS_EXTENSION__
  ? // @ts-ignore
    window.__REDUX_DEVTOOLS_EXTENSION__()
  : (f: Function) => f;

const middlewareEnhancer = applyMiddleware(thunk);
const composedMiddleware = compose(middlewareEnhancer, composedEnhancer);
export const store = createStore(rootReducer, composedMiddleware);
