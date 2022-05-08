import * as React from 'react';
import { ModalContainer, ModalItem } from '../design/components/Modal';
import { RootState } from '../redux/reducer';
import { closeModal, ModalShowType } from '../redux/modal';
import { PromptInfoModal, promptInfoModal } from '../redux/infoModal';
import { connect } from 'react-redux';
import { ActionButtonContainer, ActionButton, Button, ButtonContainer } from '../design/components/buttons';
import { Identity } from '../redux/identity';
import CloseIcon from '../icons/close_icon';

interface ModalProps {
  closeModal: ModalShowType;
  modalItems: string[];
  onSelect: (val: any) => void;
  onCompleteEdit: any;
  user: Identity;
  triggeredBy: string;
  promptInfoModal: PromptInfoModal;
}

type ModalState = {
  isEditable: { id: string };
  modalItems: { [id: number]: string };
};

class Modal extends React.Component<ModalProps, ModalState> {
  constructor(props: any) {
    super(props);
    let obj: ModalState = {
      isEditable: { id: '' },
      modalItems: {},
    };
    for (let i = 0; i < props.modalItems.length; i++) {
      obj.modalItems[i] = props.modalItems[i];
    }
    this.state = {
      ...obj,
    };
    this.handleSelection = this.handleSelection.bind(this);
  }

  handleSelection(item: string, isEditing: boolean) {
    if (isEditing) {
      return;
    }
    this.props.onSelect(item);
    this.props.closeModal();
  }

  addModalItem() {
    const index = Object.keys(this.state.modalItems).length.toString();
    this.setState((prevState) => ({
      modalItems: { ...prevState.modalItems, [index]: '' },
      isEditable: { id: index },
    }));
  }
  completeEdit() {
    const { modalItems } = this.state;
    //if the user didn't enter a value we wanna clean that up
    let cleanedUpState: any = {};
    for (const key in modalItems) {
      if (modalItems[key] !== '') {
        cleanedUpState[key] = modalItems[key];
      }
    }
    const isValidEntry = !Object.values(this.state.modalItems).some((entry) => entry === '');

    this.setState({
      modalItems: { ...cleanedUpState },
      isEditable: { id: '' },
    });
    if (isValidEntry) {
      const index = Object.keys(this.state.modalItems).length - 1;
      const { language, uid } = this.props.user;
      const context = {
        language,
        uid: uid!,
        category: this.state.modalItems[index],
      };
      this.props.onCompleteEdit(context);
    }
  }
  handleEdit(e: React.ChangeEvent<HTMLInputElement>, id: string) {
    this.setState((prevState) => ({
      modalItems: { ...prevState.modalItems, [id]: e.target.value },
    }));
  }

  componentDidMount() {
    this.props.promptInfoModal({ type: 'empty', message: '' });
  }

  render(): JSX.Element {
    const { closeModal } = this.props;
    const { isEditable } = this.state;
    const modalItems = Object.entries(this.state.modalItems);
    return (
      <ModalContainer>
        <ActionButtonContainer>
          <ActionButton appearance={'regular'} onClick={closeModal}>
            <CloseIcon />
          </ActionButton>
        </ActionButtonContainer>
        {modalItems.map((item) => {
          const [id, modalItem] = item;
          const isBeingEdited = id === isEditable.id && isEditable.id !== '';
          return (
            <ModalItem
              key={id}
              onClick={() => this.handleSelection(modalItem, isBeingEdited)}
              isActive={id === isEditable.id}
            >
              <input
                onFocus={() => this.setState({ isEditable: { id } })}
                value={modalItem}
                onChange={(e) => this.handleEdit(e, id)}
                name={id}
              />
              <label>{modalItem}</label>
              {isBeingEdited && (
                <button style={{ zIndex: 999 }} onClick={this.completeEdit.bind(this)}>
                  Add
                </button>
              )}
            </ModalItem>
          );
        })}
        {this.props.triggeredBy === 'category' && (
          <ButtonContainer>
            <Button appearance={'submit'} onClick={this.addModalItem.bind(this)} disabled={!!this.state.isEditable.id}>
              Add new category
            </Button>
          </ButtonContainer>
        )}
      </ModalContainer>
    );
  }
}

const actionCreators = {
  closeModal,
  promptInfoModal,
};

const mapStateToProps = (state: RootState) => ({
  modalItems: state.modal.modalItems,
  triggeredBy: state.modal.triggeredBy,
  user: state.user,
});
export default connect(mapStateToProps, actionCreators)(Modal);
