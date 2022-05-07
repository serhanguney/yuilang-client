import * as React from 'react';
import { connect } from 'react-redux';
import Modal from '../../Modal';

import { RootState } from '../../../redux/reducer';
import {
  ModalItemsType,
  ModalShowType,
  setModalItems,
  showModal,
  ReducerState as ModalState,
} from '../../../redux/modal';
import { ReducerState as ContentState } from '../../../redux/content';

import { MenuOpener } from '../../../design/components/MenuOpener';
import { MainSection, SectionContainer } from '../../../design/components/containers';
import { YuiTitle, YuiTitleLine } from '../../../design/components/YuiTitle';
import { difficultyLimits, difficultyType, minExpectedCapacity } from '../../../utils/fixedValues';
import { Button, ButtonContainer } from '../../../design/components/buttons';
import PracticeModal from './PracticeModal';
import { ValueOf } from '../../../utils/fixedValues';
import InfoLine from '../../../design/components/InfoLine';
import { PromptInfoModal, promptInfoModal } from '../../../redux/infoModal';

export interface Option<T> {
  selected: T;
  description: string;
  options: T[];
}

export interface Selection {
  levelOfDifficulty: Option<keyof difficultyType | ''>;
  category: Option<string>;
}

interface PracticeSectionsState {
  selections: Selection;
  isReadyToExercise: boolean;
  showExercise: boolean;
  mediumDifficultyCount: number;
  highDifficultyCount: number;
}

interface PracticeSectionProps {
  modal: ModalState<keyof Selection>;
  setModalItems: ModalItemsType;
  showModal: ModalShowType;
  content: ContentState;
  promptInfoModal: PromptInfoModal;
}

class PracticeSection extends React.Component<PracticeSectionProps, PracticeSectionsState> {
  private readonly categories = [''];

  constructor(props: any) {
    super(props);
    if ('categories' in this.props.content.userContent) {
      this.categories = Object.keys(this.props.content.userContent.categories);
    }

    this.state = {
      selections: {
        category: {
          selected: '',
          description: 'Choose your category',
          options: this.categories,
        },
        levelOfDifficulty: {
          selected: '',
          description: `Medium is for phrases practiced below ${difficultyLimits.medium}. <br /> High is for phrases practiced below ${difficultyLimits.high}`,
          options: ['medium', 'high'],
        },
      },
      isReadyToExercise: false,
      showExercise: false,
      mediumDifficultyCount: 0,
      highDifficultyCount: 0,
    };
    this.openMenu = this.openMenu.bind(this);
  }

  //this is checking if phrases of the selected difficulty exists in selected category
  validateSelection() {
    const userContent = this.props.content.userContent;
    const selectedCategory = this.state.selections.category.selected;
    const selectedLevelOfDifficulty = this.state.selections.levelOfDifficulty.selected;
    let arrayOfSelectedPhrases: any[] = [];
    if ('categories' in userContent) {
      arrayOfSelectedPhrases = Object.values(userContent.categories[selectedCategory].phrases);
    }

    if (!selectedLevelOfDifficulty) return;

    const existsLevelOfDifficulty = arrayOfSelectedPhrases.filter(
      (phrase: any) => phrase.practiceCount < difficultyLimits[selectedLevelOfDifficulty]
    );
    if (arrayOfSelectedPhrases.length > minExpectedCapacity && existsLevelOfDifficulty) {
      return true;
    }
    this.props.promptInfoModal({
      type: 'error',
      message: `either minExpectedCapacity(currently ${arrayOfSelectedPhrases.length}) is not reached or selected level of difficulty has no capacity`,
    });
    return false;
  }

  handleSelection(value: ValueOf<Selection>) {
    if (this.props.modal.triggeredBy === 'levelOfDifficulty' && !this.state.selections.category.selected) {
      this.props.promptInfoModal({ type: 'info', message: 'select category first' });
      return;
    }

    const trigger = this.props.modal.triggeredBy as keyof Selection;
    this.setState({
      ...this.state,
      selections: {
        ...this.state.selections,
        [trigger]: {
          ...this.state.selections[trigger],
          selected: value,
        },
      },
    });
  }

  componentDidUpdate(
    prevProps: Readonly<PracticeSectionProps>,
    prevState: Readonly<PracticeSectionsState>,
    snapshot?: any
  ) {
    if (prevState.selections.levelOfDifficulty.selected !== this.state.selections.levelOfDifficulty.selected) {
      const isReadyToExercise =
        !!this.state.selections.levelOfDifficulty.selected && !!this.state.selections.category.selected;
      if (isReadyToExercise) {
        const isValid = this.validateSelection();
        if (isValid) {
          this.props.promptInfoModal({ type: 'info', message: 'ready to exercise' });
          this.setState({
            isReadyToExercise: true,
          });
        }
      }
    }
  }

  openMenu(trigger: keyof Selection, options: string[]) {
    this.props.setModalItems(options, trigger);
    this.props.showModal();
  }

  goToExercise() {
    if (!this.state.isReadyToExercise) {
      this.props.promptInfoModal({
        type: 'error',
        message: `Make sure you selected difficulty(${this.state.selections.levelOfDifficulty.selected}) and category(${this.state.selections.category.selected}) first`,
      });
      return;
    }
    this.props.promptInfoModal({ type: 'empty', message: '' });
    this.setState({
      showExercise: true,
    });
  }

  render() {
    const { selections, showExercise } = this.state;

    return (
      <MainSection>
        {this.props.modal.isModalOpen && <Modal onSelect={this.handleSelection.bind(this)} />}
        <SectionContainer>
          {Object.entries(selections).map((item, index) => {
            const [key, { selected, options, description }] = item;
            return (
              <MenuOpener key={index} onClick={() => this.openMenu(key as keyof Selection, options)}>
                <div>
                  <h3>{selected ? selected : key}</h3>
                  <p dangerouslySetInnerHTML={{ __html: description }} />
                </div>
              </MenuOpener>
            );
          })}
        </SectionContainer>
        <YuiTitle hasFullLength={true}>
          <p>Statistics</p>
          <YuiTitleLine hasFullLength={true} />
        </YuiTitle>
        <SectionContainer>
          {selections.category.options.map((option) => {
            let count = 0;
            let percentage = 0;
            let totalCountOfPhrases = null;
            if ('categories' in this.props.content.userContent) {
              const category = this.props.content.userContent.categories[option];
              count = category?.practiceCount;
              totalCountOfPhrases = Object.keys(category.phrases).length;
            }
            if ('practiceCount' in this.props.content.userContent) {
              const divider = totalCountOfPhrases || 1;
              percentage = (count / divider) * 100;
            }

            return (
              <InfoLine
                key={option}
                heading={option}
                description={`Your progress in ${option} category`}
                count={totalCountOfPhrases!}
                percentage={Math.floor(percentage)}
              />
            );
          })}
        </SectionContainer>
        <ButtonContainer>
          <Button appearance={'button'} onClick={this.goToExercise.bind(this)}>
            START EXERCISE
          </Button>
        </ButtonContainer>
        {showExercise && (
          <PracticeModal
            levelOfDifficulty={selections.levelOfDifficulty.selected}
            category={selections.category.selected}
            onClose={() => this.setState({ showExercise: false })}
          />
        )}
      </MainSection>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    content: state.content,
    modal: state.modal,
  };
};

const mapActionsToProps = {
  showModal,
  setModalItems,
  promptInfoModal,
};
export default connect(mapStateToProps, mapActionsToProps)(PracticeSection);
