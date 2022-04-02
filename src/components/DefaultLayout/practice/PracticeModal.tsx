import * as React from 'react';
import { connect } from 'react-redux';

import { RootState } from '../../../redux/reducer';
import { ReducerState as ContentState } from '../../../redux/content';

import { ModalContainer } from '../../../design/components/Modal';
import { difficultyType } from '../../../utils/fixedValues';
import { ActionButton, Button, ButtonContainer } from '../../../design/components/buttons';
import { YuiTitle, YuiTitleLine } from '../../../design/components/YuiTitle';
import { SectionContainer } from '../../../design/components/containers';
import CircleProgress from '../../CircleProgress';
import PracticeResult from './PracticeResult';
import { assembleExercise, submitPractice, IPayload, ISubmitCtx, restartPractice } from '../../../redux/practice';
import { EXERCISE_CREATED } from '../../../redux/constants';
import Loading from '../../Loading';
import { Identity } from '../../../redux/identity';
import styled from 'styled-components';

interface PracticeModalProps {
  user: Identity;
  levelOfDifficulty: keyof difficultyType;
  category: string;
  content: ContentState;
  assembleExercise: any;
  exercise: any;
  submitPractice: (ctx: ISubmitCtx) => void;
  restartPractice: () => void;
  onClose: () => void;
}
const StyledActionButton = styled(ActionButton)`
  margin-left: auto;
  margin-right: 20px;
`;
const StyledButtonContainer = styled(ButtonContainer)`
  margin: 10px 40px;
`;
const BottomSection = styled.div`
  margin-top: 40px;
  margin-bottom: 100px;
`;
class PracticeModal extends React.Component<PracticeModalProps, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      progressPercentage: '',
      selected: {},
      showResult: false,
    };
    this.handleSelect = this.handleSelect.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  prepareExercise() {
    const usersDifficultySelection = this.props.levelOfDifficulty;
    const usersCategorySelection = this.props.category;
    const filteredPhrasesByType: any = {};
    if ('categories' in this.props.content.userContent) {
      const selectedPhrases: any = this.props.content.userContent.categories[usersCategorySelection].phrases;
      const type = Math.random() < 0.5 ? 'word' : 'sentence';
      console.log('preparing exercise with', type);

      for (const key in selectedPhrases) {
        const value = selectedPhrases[key];
        if (value.type === type) {
          filteredPhrasesByType[key] = value;
        }
      }
    }

    this.props.assembleExercise(filteredPhrasesByType, usersDifficultySelection, []);
  }

  componentDidMount() {
    this.prepareExercise();
    let count = 0;
    let divider = 1;
    if ('practiceCount' in this.props.content.userContent) {
      divider = this.props.content.userContent.practiceCount || 1;
    }
    if ('categories' in this.props.content.userContent) {
      count = this.props.content.userContent.categories[this.props.category].practiceCount;
    }
    this.setState({ progressPercentage: count / divider });
  }

  async handleSubmit() {
    const { isCorrect, id } = this.state.selected;
    const {
      user: { uid, language },
      category,
    } = this.props;
    await this.props.submitPractice({
      isCorrect,
      phraseID: id,
      uid,
      language,
      category,
    });
    this.setState({ showResult: true });
  }

  handleSelect(option: IPayload) {
    this.setState({ selected: option });
  }

  restartExercise() {
    this.props.restartPractice();
    this.setState({ showResult: false });
    this.prepareExercise();
  }

  render() {
    const { exercise, onClose } = this.props;
    const hasSelected = Object.keys(this.state.selected).length > 0;
    if (exercise.assembleStatus !== EXERCISE_CREATED) {
      return <Loading />;
    }
    const correctAnswer = exercise.options.filter((option: any) => option.isCorrect)[0].phrase;

    return (
      <ModalContainer>
        <SectionContainer isCentered={true}>
          {/*Progress Circle*/}
          <StyledActionButton appearance={'regular'} onClick={() => onClose()}>
            x
          </StyledActionButton>
          <CircleProgress appearance={'regular'} size={'large'} percentage={this.state.progressPercentage} />
          <h1>Exercise Count</h1>
          {/*Question*/}
          {exercise.options.length === 0 ? (
            <div>Selected category doesn't have more than 4 phrases!</div>
          ) : (
            <div>{correctAnswer.phrase} ?</div>
          )}
        </SectionContainer>
        <YuiTitle hasFullLength={true}>
          <YuiTitleLine hasFullLength={true} />
        </YuiTitle>
        {/*Answers*/}
        {exercise.options.map((option: any) => (
          <StyledButtonContainer key={option.phrase.inEnglish}>
            <Button
              onTouch={this.state.selected === option}
              appearance={'regular'}
              onClick={() => this.handleSelect(option)}
            >
              {option.phrase.inEnglish}
            </Button>
          </StyledButtonContainer>
        ))}
        <BottomSection>
          {this.state.showResult ? (
            <PracticeResult isCorrect={this.state.selected.isCorrect} onRestart={this.restartExercise.bind(this)} />
          ) : (
            <ButtonContainer>
              <Button appearance={'submit'} onClick={this.handleSubmit}>
                SUBMIT
              </Button>
            </ButtonContainer>
          )}
        </BottomSection>
      </ModalContainer>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  user: state.user,
  content: state.content,
  exercise: state.exercise,
});
const actionCreators = {
  assembleExercise,
  submitPractice,
  restartPractice,
};
export default connect(mapStateToProps, actionCreators)(PracticeModal);
