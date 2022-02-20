import styled from 'styled-components';
import { measures, spaces, colors } from '../fixedValues';
import { useState } from 'react';

interface IWrapper {
  hasFocus: boolean;
}

const InputWrapper = styled.div<IWrapper>`
  position: relative;
  padding: ${spaces.medium};
  display: flex;
  flex-direction: column;
  opacity: ${(props) => (props.hasFocus ? 1 : 0.6)};
`;

const Label = styled.label`
  font-size: ${measures.smallFontSize};
`;

const Input = styled.input`
  padding: ${spaces.small};
  border: none;
  border-bottom: 1px solid ${colors.black};
  outline: none;
`;

const UserInput = (props: any) => {
  const [hasFocus, setHasFocus] = useState(false);
  return (
    <InputWrapper hasFocus={hasFocus}>
      <Label htmlFor={props.name}>{props.name}</Label>
      <Input onFocus={() => setHasFocus(true)} onBlur={() => setHasFocus(false)} {...props} />
    </InputWrapper>
  );
};

export default UserInput;
