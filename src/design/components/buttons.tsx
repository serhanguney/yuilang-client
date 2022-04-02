import * as React from 'react';
import { AppearanceNames } from '../theme';
import styled from 'styled-components';
import { measures, spaces, dimensions } from '../fixedValues';

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  appearance: AppearanceNames;
  onTouch?: boolean;
}
export const ButtonContainer = styled.div`
  display: flex;
  margin: auto ${spaces.large} 0 ${spaces.large};
`;

export const Button = styled.button<ButtonProps>`
  background-color: ${(props) =>
    props.theme.getAppearanceColor(props.appearance, props.onTouch ? 'text' : 'background')};
  flex-grow: 1;
  padding: ${spaces.medium} ${spaces.small};
  margin: 0 ${spaces.small};
  border-radius: ${measures.borderRadius};
  color: ${(props) => props.theme.getAppearanceColor(props.appearance, props.onTouch ? 'background' : 'text')};
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  &:disabled {
    background-color: ${(props) => props.theme.getAppearanceColor('regular', 'background')};
  }
  &:focus {
    background-color: ${(props) => props.theme.getAppearanceColor(props.appearance, 'text')};
    color: ${(props) => props.theme.getAppearanceColor(props.appearance, 'background')};
  }
`;

export const ActionButtonContainer = styled.div<{ isCentered?: boolean }>`
  margin: auto;
  margin-bottom: ${spaces.small};
  margin-top: ${(props) => (props.isCentered ? 'auto' : 'unset')};
`;

export const ActionButton = styled.button<ButtonProps>`
  display: block;
  margin-top: ${spaces.small};
  background-color: ${(props) => props.theme.getAppearanceColor(props.appearance, 'background')};
  color: ${(props) => props.theme.getAppearanceColor(props.appearance, 'text')};
  border-radius: ${measures.actionRadius};
  width: ${dimensions.buttonWidth};
  height: ${dimensions.buttonWidth};
  font-size: ${measures.actionFontSize};
`;
