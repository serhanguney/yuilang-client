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

export interface Option<T> {
  selected: T;
  options: T[];
}

export interface Selection {
  levelOfDifficulty: Option<keyof difficultyType>;
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
          options: this.categories,
        },
        levelOfDifficulty: {
          selected: 'medium',
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

    const existsLevelOfDifficulty = arrayOfSelectedPhrases.filter(
      (phrase: any) => phrase.practiceCount < difficultyLimits[selectedLevelOfDifficulty]
    );
    if (arrayOfSelectedPhrases.length > minExpectedCapacity && existsLevelOfDifficulty) {
      return true;
    }
    return false;
  }

  handleSelection(value: ValueOf<Selection>) {
    if (this.props.modal.triggeredBy === 'levelOfDifficulty' && !this.state.selections.category.selected) {
      //TODO replace with error modal
      console.log('select category first');
      return;
    }

    const trigger = this.props.modal.triggeredBy as keyof Selection;
    this.setState((prevState) => ({
      ...prevState,
      selections: {
        ...prevState.selections,
        [trigger]: {
          ...prevState.selections[trigger],
          selected: value,
        },
      },
    }));

    const isReadyToExercise =
      !!this.state.selections.levelOfDifficulty.selected && !!this.state.selections.category.selected;
    console.log('isReady', isReadyToExercise);
    if (isReadyToExercise) {
      const isValid = this.validateSelection();
      console.log('@@', isValid);
      if (isValid) {
        console.log('ready to exercise');
        this.setState({
          isReadyToExercise: true,
        });
      } else {
        //TODO replace with error modal
        console.log(
          'selected phrase does not fulfill one of the following aspects: \n selected category capacity is less than minExpectedCapacity \n selected difficulty capacity does not exists'
        );
      }
    }
  }

  handleCompleteEdit() {}

  openMenu(trigger: keyof Selection, value: ValueOf<Selection>) {
    this.props.setModalItems(value.options, trigger);
    this.props.showModal();
  }

  goToExercise() {
    if (!this.state.isReadyToExercise) {
      console.log('prepare exercise failed', this.state.isReadyToExercise);
      return;
    }

    this.setState({
      showExercise: true,
    });
  }

  render() {
    const { selections, showExercise } = this.state;

    return (
      <MainSection>
        {this.props.modal.isModalOpen && (
          <Modal onCompleteEdit={this.handleCompleteEdit.bind(this)} onSelect={this.handleSelection.bind(this)} />
        )}
        <SectionContainer>
          {Object.entries(selections).map((item, index) => {
            const [key, value] = item;
            return (
              <MenuOpener key={index} onClick={() => this.openMenu(key as keyof Selection, value)}>
                <div>
                  <h3>{value.selected ? value.selected : key}</h3>
                  <p>{key === '' ? `Choose your ${key}` : key}</p>
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
                description={`Your practice progress in ${option} category`}
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
};

export default connect(mapStateToProps, mapActionsToProps)(PracticeSection);
