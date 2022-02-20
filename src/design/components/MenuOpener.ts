import styled from 'styled-components';
import { colors, measures, spaces } from '../fixedValues';
import { ReactNode } from 'react';

interface MenuOpenerProps {
  children: ReactNode;
}

// requires a p and h3 tag

export const MenuOpener = styled.div<MenuOpenerProps>`
  display: flex;
  padding: ${spaces.small} ${spaces.large};
  border-bottom: ${measures.borderThickness} solid ${colors.secondary};
  flex-direction: column;
  &::after {
    content: '';
    display: inline-block;
    border-top: 6px solid transparent;
    border-bottom: 6px solid transparent;
    border-left: 6px solid ${colors.black};
    flex: 0;
    height: 0;
    width: 0;
    margin: auto ${spaces.small} auto auto;
  }
  h3 {
    font-size: ${measures.largeFontSize};
    margin: 0 0 ${spaces.tiny} 0;
    color: ${colors.black};
  }
  p {
    font-size: ${measures.smallFontSize};
    margin: 0;
    color: ${colors.primary};
    opacity: 0.6;
    font-weight: ${measures.thinFontWeight};
  }
`;
