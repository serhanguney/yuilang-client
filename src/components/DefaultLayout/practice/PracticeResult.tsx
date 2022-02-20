import React from 'react';

interface IPracticeResult {
  isCorrect: boolean;
  onRestart: () => void;
}

export default class PracticeResult extends React.Component<IPracticeResult, any> {
  render() {
    const { isCorrect } = this.props;
    return (
      <>
        <h1>Your answer is: {isCorrect ? 'Correct' : 'Wrong'}</h1>
        <button onClick={() => this.props.onRestart()}>OK</button>
      </>
    );
  }
}
