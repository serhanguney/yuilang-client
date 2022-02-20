import styled from 'styled-components';
import { colors, measures } from '../fixedValues';

export const Overlay = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  background-color: ${colors.overlay};
  opacity: ${measures.highOpacity};
  z-index: ${measures.zSecondLevel};
  pointer-events: none;
  transition: all ease-in-out ${measures.transitionFast};
`;
