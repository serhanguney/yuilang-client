import * as React from 'react';
import styled from 'styled-components';
import { colors, measures, spaces } from '../../../design/fixedValues';

const PhraseContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const CustomTextArea = styled.textarea`
  height: ${measures.textAreaHeight};
  border: none;
  resize: none;
  outline: none;
  padding: ${spaces.small};
  font-family: inherit;
  flex-grow: 1;
  color: inherit;
  &::placeholder {
    opacity: 0.3;
    font-weight: 300;
  }
`;

const DisplayTranslation = styled.div`
  height: ${measures.textAreaHeight};
  padding: ${spaces.small};
  flex-grow: 1;
  border-top: 2px solid ${colors.secondary};
`;

class EnterPhrase extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      isFocused: false,
    };
  }

  handleFocus() {
    if (this.props.isTypingDisabled) {
      console.error('Make sure to select type and category before translation', this.props.isTypingEnabled);
      return;
    }
    this.setState({
      isFocused: true,
    });
    this.props.bringFocus(true);
  }
  handleBlur() {
    if (this.props.phrase.length === 0) {
      this.setState({
        isFocused: false,
      });
    }
    this.props.bringFocus(false);
  }
  handleKeyInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    this.props.handleChange(e.target.value);
  }
  render(): JSX.Element {
    const { translatedPhrase, phrase, isTypingDisabled } = this.props;
    const placeHolder = isTypingDisabled ? 'Please choose the options above first' : 'Enter your phrase';
    return (
      <PhraseContainer>
        <CustomTextArea
          value={phrase}
          onFocus={() => this.handleFocus()}
          onBlur={() => this.handleBlur()}
          onChange={(e) => this.handleKeyInput(e)}
          placeholder={placeHolder}
          disabled={isTypingDisabled}
        />
        {this.state.isFocused && <DisplayTranslation>{translatedPhrase}</DisplayTranslation>}
      </PhraseContainer>
    );
  }
}

export default EnterPhrase;
