import * as React from 'react';
import { connect } from 'react-redux';
import {
  initialiseAddPhraseRequest,
  initialiseAddCategoryRequest,
  PhraseRequestType,
  CategoryRequestType,
  CategoryRequestProps,
} from '../../../redux/firebase';
import { RootState } from '../../../redux/reducer';
import { ModalItemsType, ModalShowType, setModalItems, showModal, TriggerType, closeModal } from '../../../redux/modal';
import { getUserData, ReducerState as ContentState, TGetUserData } from '../../../redux/content';
import { ReducerState as ModalState } from '../../../redux/modal';
import { Identity } from '../../../redux/identity';

import ChooseLanguage from './ChooseLanguage';
import EnterPhrase from './EnterPhrase';

import Modal from '../../Modal';
import { MenuOpener } from '../../../design/components/MenuOpener';
import { Button, ButtonContainer } from '../../../design/components/buttons';
import { SectionContainer, CategoryContainer, MainSection } from '../../../design/components/containers';
import { YuiTitle, YuiTitleLine } from '../../../design/components/YuiTitle';
import { Overlay } from '../../../design/components/Overlay';

import { debounce } from '../../../utils/tools';
import { LanguageLiterals, languages } from '../../../utils/fixedValues';
import { REQUEST_URL } from '../../../utils/constants';
import { DatabaseModel } from '../../../conf/dataModel';

//TYPES
interface Selection {
  value: string;
  options: string[];
}

export interface Selections {
  type: Selection;
  category: Selection;
}

interface VocabularyState {
  phrase: string;
  translatedPhrase: string;
  targetLanguage: string;
  inEnglish: string;
  to: LanguageLiterals;
  from: LanguageLiterals;
  selections: Selections;
  isReadyToSubmit: boolean;
  hasPhraseFocus: boolean;
}

interface VocabularyProps {
  setModalItems: ModalItemsType;
  initialiseAddPhraseRequest: PhraseRequestType;
  initialiseAddCategoryRequest: CategoryRequestType;
  showModal: ModalShowType;
  closeModal: ModalShowType;
  content: ContentState;
  modal: ModalState<keyof Selections>;
  user: Identity;
  getUserData: TGetUserData;
}

class VocabularySection extends React.Component<VocabularyProps, VocabularyState> {
  private readonly debounceTranslate: (debouncedFn: () => void) => void;
  private readonly categories: string[] = [''];

  constructor(props: any) {
    super(props);
    if ('categories' in this.props.content.userContent) {
      this.categories = Object.keys(this.props.content.userContent.categories);
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSwitch = this.handleSwitch.bind(this);
    this.state = {
      phrase: '',
      translatedPhrase: '',
      targetLanguage: languages.czech,
      inEnglish: '',
      to: 'czech',
      from: 'english',
      selections: {
        type: { value: '', options: ['word', 'sentence'] },
        category: { value: '', options: this.categories },
      },
      isReadyToSubmit: false,
      hasPhraseFocus: false,
    };
    this.debounceTranslate = debounce(this.setState, 1000);
  }

  componentDidUpdate(prevProps: Readonly<VocabularyProps>, prevState: Readonly<VocabularyState>) {
    let previousContent = [];
    let currentContent: any[] = [];
    if ('categories' in this.props.content.userContent) {
      //@ts-ignore
      previousContent = Object.keys(prevProps.content.userContent.categories);
      currentContent = Object.keys(this.props.content.userContent.categories);
    }

    if (previousContent.length !== currentContent.length) {
      this.setState((prevState) => ({
        selections: {
          ...prevState.selections,
          category: {
            ...prevState.selections.category,
            options: currentContent,
          },
        },
      }));
    }
  }

  async requestTranslation(phrase: string, targetLanguage: string) {
    try {
      const response = await fetch(`${REQUEST_URL}/translate`, {
        method: 'POST',
        body: JSON.stringify({ phrase, targetLanguage }),
      });

      let result;
      if (response.ok) {
        result = await response.text();
      }
      if (result) {
        const inEnglish = targetLanguage === languages['english'] ? result : phrase;
        this.setState({
          translatedPhrase: result,
          inEnglish,
        });

        // handle wrong translation
        if (phrase.split(' ').join('') === result.split(' ').join('')) {
          console.error('Both phrases are the exact same equal');
          return;
        }
        // handle isReadyToSubmit
        const isReadyToSubmit =
          this.state.phrase &&
          this.state.inEnglish &&
          this.state.targetLanguage &&
          this.state.selections.type.value &&
          this.state.selections.category.value;
        if (isReadyToSubmit) {
          console.log('Phrase is ready to submit');
          this.setState({ isReadyToSubmit: true });
        }
      }
    } catch (err: any) {
      throw new Error(err);
    }
  }

  handleChange(userInput: string) {
    if (userInput.trim().length === 0) {
      this.setState({
        ...this.state,
        translatedPhrase: '',
        phrase: '',
      });
      return;
    }
    const targetLanguage = languages[this.state.to];
    this.setState({
      ...this.state,
      phrase: userInput,
    });

    const debouncedFn = () => {
      this.requestTranslation(this.state.phrase, targetLanguage);
    };
    this.debounceTranslate(debouncedFn);
  }

  async handleSubmit() {
    if (!this.state.isReadyToSubmit) {
      return;
    } else if (this.props.user.uid) {
      const content = this.props.content.userContent as DatabaseModel;
      const category = this.state.selections.category.value;
      const categoryCount = content.categories[category].practiceCount;
      const phrase = this.state.to === 'czech' ? this.state.translatedPhrase : this.state.phrase;

      await this.props.initialiseAddPhraseRequest({
        uid: this.props.user.uid,
        language: this.props.user.language,
        type: this.state.selections.type.value,
        inEnglish: this.state.inEnglish,
        phrase,
        categoryCount,
        category,
      });
      this.setState({ phrase: '', translatedPhrase: '' });
    }
  }

  handleSwitch() {
    if (this.state.translatedPhrase.length > 0) {
      this.setState((prevState) => ({
        ...prevState,
        phrase: prevState.translatedPhrase,
        translatedPhrase: prevState.phrase,
        targetLanguage: prevState.from,
        to: prevState.from,
        from: prevState.to,
      }));
    } else {
      this.setState((prevState) => ({
        ...prevState,
        targetLanguage: prevState.from,
        to: prevState.from,
        from: prevState.to,
      }));
    }
  }

  handleSelection(selection: string) {
    this.setState((prevState) => ({
      ...prevState,
      selections: {
        ...prevState.selections,
        [this.props.modal.triggeredBy]: {
          ...prevState.selections[this.props.modal.triggeredBy as keyof Selections],
          value: selection,
        },
      },
    }));
  }

  triggerDropdown(trigger: TriggerType) {
    const options = this.state.selections[trigger as keyof Selections].options;
    this.props.setModalItems(options, trigger);
    this.props.showModal();
  }

  handleBringFocus(value: boolean) {
    this.setState({ hasPhraseFocus: value });
  }

  async handleModalComplete(ctx: CategoryRequestProps) {
    this.props.initialiseAddCategoryRequest(ctx);
    await this.props.getUserData(this.props.user.uid);
    this.props.closeModal();
  }

  render(): JSX.Element {
    const { selections } = this.state;
    const isTypingDisabled = !(selections.type.value && selections.category.value);
    return (
      <MainSection>
        {(this.state.hasPhraseFocus || this.props.modal.isModalOpen) && <Overlay />}
        {this.props.modal.isModalOpen && (
          <Modal onCompleteEdit={this.handleModalComplete.bind(this)} onSelect={this.handleSelection.bind(this)} />
        )}
        <SectionContainer>
          <CategoryContainer>
            {Object.keys(selections).map((item, index) => (
              <MenuOpener key={index} onClick={() => this.triggerDropdown(item as keyof Selections)}>
                <h3>{item}</h3>
                <p>
                  {selections[item as keyof Selections].value
                    ? selections[item as keyof Selections].value
                    : `Choose ${item}`}
                </p>
              </MenuOpener>
            ))}
          </CategoryContainer>
        </SectionContainer>

        <SectionContainer isTopLevel={this.state.hasPhraseFocus}>
          <YuiTitle hasFullLength={true}>
            <p>New phrase</p>
            <YuiTitleLine hasFullLength={true} />
          </YuiTitle>
          <ChooseLanguage handleSwitch={this.handleSwitch} to={this.state.to} from={this.state.from} />
          <EnterPhrase
            handleChange={this.handleChange}
            translatedPhrase={this.state.translatedPhrase}
            phrase={this.state.phrase}
            isTypingDisabled={isTypingDisabled}
            bringFocus={this.handleBringFocus.bind(this)}
          />
        </SectionContainer>
        <ButtonContainer>
          <Button appearance={'button'} onClick={this.handleSubmit.bind(this)}>
            ADD PHRASE
          </Button>
        </ButtonContainer>
      </MainSection>
    );
  }
}

const mapActionsToProps = {
  initialiseAddPhraseRequest,
  initialiseAddCategoryRequest,
  setModalItems,
  showModal,
  closeModal,
  getUserData,
};
const mapStateToProps = (state: RootState) => ({
  content: state.content,
  modal: state.modal,
  user: state.user,
});
export default connect(mapStateToProps, mapActionsToProps)(VocabularySection);
