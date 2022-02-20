import { assembleAttemptLimit, difficultyLimits, difficultyLiterals, practiceCardOptions } from '../utils/fixedValues';
import { Dispatch } from 'react';
import {
  EMPTY_EXERCISE,
  ATTEMPT_IN_PROGRESS,
  EXERCISE_FAILED,
  EXERCISE_CREATED,
  AssembleStatusType,
  PRACTICE_FAILED,
  PRACTICE_IDLE,
  PracticeResultType,
  PRACTICE_SUCCESSFUL,
} from './constants';
import { PhraseModel } from '../conf/dataModel';

export interface IPayload {
  isCorrect: boolean;
  phrase: PhraseModel;
  id: string;
}

interface ReducerState {
  assembleStatus: AssembleStatusType;
  options: IPayload[];
  result: PracticeResultType;
}

export interface ISubmitCtx {
  category: string;
  uid: string;
  phraseID: string;
  language: string;
  isCorrect: boolean;
}

const attemptToCreateExercise = () => ({ type: ATTEMPT_IN_PROGRESS });
const exerciseCreated = (payload: IPayload[]) => ({
  type: EXERCISE_CREATED,
  payload,
});
const failedToCreateExercise = () => ({ type: EXERCISE_FAILED });
const findIndexOfRandomElement = (length: number) => Math.floor(Math.random() * length);

const practiceSuccessful = () => ({ type: PRACTICE_SUCCESSFUL });
const practiceFailed = () => ({ type: PRACTICE_FAILED });
const resetPractice = () => ({ type: PRACTICE_IDLE });

let assembleAttemptCount = 0;

const shuffleArray = (array: IPayload[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};

const assemble = (allAnswers: any, correctAnswer: any, cardOptions: IPayload[]) => {
  let index: number;
  cardOptions[0] = {
    isCorrect: true,
    phrase: correctAnswer[1],
    id: correctAnswer[0],
  };
  for (let i = 1; i < practiceCardOptions; i++) {
    index = findIndexOfRandomElement(allAnswers.length);

    const isDuplicate = cardOptions.some(
      // @ts-ignore
      (item: any) => item.phrase.inEnglish === allAnswers[index][1].inEnglish
    );
    if (!isDuplicate) {
      cardOptions[i] = {
        isCorrect: false,
        phrase: allAnswers[index][1],
        id: allAnswers[index][0],
      };
      assembleAttemptCount = 0;
    } else if (assembleAttemptCount < assembleAttemptLimit) {
      assembleAttemptCount++;

      assemble(allAnswers, correctAnswer, cardOptions);
    }
  }
  cardOptions = cardOptions.filter((option: any) => !!option);
  return cardOptions;
};

export const assembleExercise =
  (allAnswers: any, difficulty: difficultyLiterals, cardOptions: any) => (dispatch: any) => {
    if (allAnswers.length < practiceCardOptions) {
      dispatch(failedToCreateExercise());
    }
    dispatch(attemptToCreateExercise());

    const correctAnswers: any = {};
    let countOfCorrectAnswers = 0;
    for (const key in allAnswers) {
      if (allAnswers[key].practiceCount < difficultyLimits[difficulty]) {
        correctAnswers[key] = allAnswers[key];
        countOfCorrectAnswers++;
      }
    }
    const correctAnswer: any = Object.entries(correctAnswers)[findIndexOfRandomElement(countOfCorrectAnswers)];
    const arrayOfAllAnswers = Object.entries(allAnswers);
    const payload = assemble(arrayOfAllAnswers, correctAnswer, cardOptions);
    dispatch(exerciseCreated(shuffleArray(payload)));
  };

export const submitPractice = (ctx: ISubmitCtx) => async (dispatch: Dispatch<any>) => {
  const { isCorrect, language, uid, phraseID, category } = ctx;
  if (!isCorrect) {
    dispatch(practiceFailed());
    return;
  }
  try {
    const response = await fetch('/practice', {
      method: 'POST',
      body: JSON.stringify({ phraseID, language, uid, category }),
    });
    if (response.ok) {
      dispatch(practiceSuccessful());
    } else {
      dispatch(practiceFailed());
    }
  } catch (err) {
    dispatch(practiceFailed());
  }
};

export const restartPractice = () => (dispatch: Dispatch<any>) => {
  dispatch(resetPractice());
};

const initialState: ReducerState = {
  assembleStatus: EMPTY_EXERCISE,
  options: [],
  result: PRACTICE_IDLE,
};
export const reducer = (state = initialState, action: any) => {
  switch (action.type) {
    case ATTEMPT_IN_PROGRESS:
      return {
        ...state,
        assembleStatus: ATTEMPT_IN_PROGRESS,
      };
    case EXERCISE_CREATED:
      return {
        ...state,
        assembleStatus: EXERCISE_CREATED,
        options: action.payload,
      };
    case EXERCISE_FAILED:
      return {
        ...state,
        assembleStatus: EXERCISE_FAILED,
      };
    case PRACTICE_IDLE:
      return {
        ...state,
        result: PRACTICE_IDLE,
      };
    case PRACTICE_SUCCESSFUL:
      return {
        ...state,
        result: PRACTICE_SUCCESSFUL,
      };
    case PRACTICE_FAILED:
      return {
        ...state,
        result: PRACTICE_FAILED,
      };
    default:
      return state;
  }
};
