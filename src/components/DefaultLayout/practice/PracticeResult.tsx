import React from 'react';
import styled from 'styled-components';
import { Button } from '../../../design/components/buttons';

interface IPracticeResult {
  isCorrect: boolean;
  onRestart: () => void;
}
const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 5px 20px;
  padding: 0 20px;
  h4 {
    margin: 5px 0;
  }
`;
export default class PracticeResult extends React.Component<IPracticeResult, any> {
  render() {
    const { isCorrect } = this.props;
    return (
      <StyledContainer>
        <h4>Your answer is: {isCorrect ? 'Correct' : 'Wrong'}</h4>
        <Button appearance={isCorrect ? 'submit' : 'cancel'} onClick={() => this.props.onRestart()}>
          OK
        </Button>
      </StyledContainer>
    );
  }
}
