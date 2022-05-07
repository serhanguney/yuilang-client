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

import { assembleExercise, submitPractice, IPayload, ISubmitCtx, restartPractice } from '../../../redux/practice';
import { promptInfoModal, PromptInfoModal } from '../../../redux/infoModal';
import { EXERCISE_CREATED } from '../../../redux/constants';
import Loading from '../../Loading';
import { Identity } from '../../../redux/identity';
import styled from 'styled-components';
import { spaces } from '../../../design/fixedValues';

const QuestionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin: 0 auto;
  padding: ${spaces.small} ${spaces.medium};
  p {
    margin: 0;
  }
`;
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
  promptInfoModal: PromptInfoModal;
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
      showNext: false,
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

    if ('categories' in this.props.content.userContent) {
      const option = this.props.category;
      const category = this.props.content.userContent.categories[option];
      const totalCountOfPhrases = Object.keys(category.phrases).length;
      const divider = totalCountOfPhrases || 1;
      const count = this.props.content.userContent.categories[this.props.category].practiceCount;
      this.setState({ progressPercentage: Math.floor((count / divider) * 100) });
    }
  }

  async handleSubmit() {
    if (!this.state.selected) {
      this.props.promptInfoModal({ type: 'info', message: 'Please select an option' });
      return;
    }

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
    const message = isCorrect ? 'correct' : 'wrong';
    this.props.promptInfoModal({ type: isCorrect ? 'success' : 'error', message });
    this.setState({ showNext: true });
  }

  handleSelect(option: IPayload) {
    this.props.promptInfoModal({ type: 'empty', message: '' });
    this.setState({ selected: option });
  }

  restartExercise() {
    if (!this.state.selected) {
      this.props.promptInfoModal({ type: 'info', message: 'Select an answer first' });
    }
    this.props.restartPractice();
    this.setState({ showNext: false });
    this.prepareExercise();
  }

  render() {
    const { exercise, onClose } = this.props;
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
          <CircleProgress appearance={'regular'} size={'medium'} percentage={this.state.progressPercentage} />
          <QuestionContainer>
            <h2>Question</h2>
            {exercise.options.length === 0 ? (
              <p>Selected category doesn't have more than 4 phrases!</p>
            ) : (
              <p>{correctAnswer.phrase} ?</p>
            )}
          </QuestionContainer>
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
          <ButtonContainer>
            {this.state.showNext ? (
              <Button appearance={'submit'} onClick={this.restartExercise.bind(this)}>
                NEXT
              </Button>
            ) : (
              <Button appearance={'submit'} onClick={this.handleSubmit}>
                SUBMIT
              </Button>
            )}
          </ButtonContainer>
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
  promptInfoModal,
};
export default connect(mapStateToProps, actionCreators)(PracticeModal);
