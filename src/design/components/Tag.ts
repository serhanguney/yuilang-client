import styled from 'styled-components';
import { colors } from '../fixedValues';
import { AppearanceNames } from '../theme';

interface TagProps {
  appearance: AppearanceNames;
  selected: boolean;
}

export const Tag = styled.button<TagProps>`
  color: ${(props) => props.theme.getAppearanceColor(props.appearance, 'text')};
  background-color: ${(props) => props.selected && props.theme.getAppearanceColor(props.appearance, 'background')};
  padding: 8px 16px;
  margin: 0 6px;
  font-weight: 300;
  font-size: 14px;
  border-radius: 5px;
  transition: all 50ms ease-in-out;
  a {
    text-decoration: none;
    color: inherit;
  }
  &:active {
    background-color: ${colors.active};
  }
`;
