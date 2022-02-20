import { ActionType } from './commons';
import { Selections as VocabularySelections } from '../components/DefaultLayout/vocabulary/VocabularySection';
import { Selection as PracticeSelection } from '../components/DefaultLayout/practice/PracticeSection';

const RECEIVED_MODAL_ITEMS = 'RECEIVED_MODAL_ITEMS';
const OPEN_MODAL = 'OPEN_MODAL';
const CLOSE_MODAL = 'CLOSE_MODAL';

export type TriggerType = keyof PracticeSelection | keyof VocabularySelections | '';

interface PayloadType<T> {
  modalItems: string[];
  triggeredBy: T;
}

export interface ReducerState<T> extends PayloadType<T> {
  isModalOpen: boolean;
}

export type ModalItemsType = (modalItems: string[], triggeredBy: TriggerType) => ActionType<PayloadType<TriggerType>>;

export type ModalShowType = () => ActionType<undefined>;

const initialState: ReducerState<TriggerType> = {
  modalItems: [],
  triggeredBy: '',
  isModalOpen: false,
};
export const setModalItems: ModalItemsType = (modalItems, triggeredBy) => ({
  type: RECEIVED_MODAL_ITEMS,
  payload: { modalItems, triggeredBy },
});
export const showModal: ModalShowType = () => ({ type: OPEN_MODAL });
export const closeModal: ModalShowType = () => ({ type: CLOSE_MODAL });

export function reducer(state = initialState, action: ActionType<PayloadType<TriggerType>>): ReducerState<TriggerType> {
  switch (action.type) {
    case RECEIVED_MODAL_ITEMS:
      return {
        ...state,
        modalItems: action.payload!.modalItems,
        triggeredBy: action.payload!.triggeredBy,
      };
    case OPEN_MODAL:
      return {
        ...state,
        isModalOpen: true,
      };
    case CLOSE_MODAL:
      return {
        ...state,
        isModalOpen: false,
      };
    default:
      return state;
  }
}
