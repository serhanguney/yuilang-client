import styled from 'styled-components';
import { colors, dimensions, measures, spaces } from '../fixedValues';

export const ModalContainer = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 90vh;
  top: 0;
  left: 0;
  z-index: ${measures.zFirstLevel};
  background-color: ${colors.white};
  box-shadow: ${measures.boxShadow};
  padding: ${spaces.medium} 0;
`;
export const ModalItem = styled.div<{ isActive: boolean }>`
  padding: ${spaces.small} ${spaces.large};
  border-bottom: ${measures.borderThickness} solid ${colors.secondary};
  position: relative;
  min-height: ${dimensions.itemHeight};
  display: flex;
  align-items: center;

  input {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    opacity: 0;
    pointer-events: ${(props) => (props.isActive ? 'auto' : 'none')};
  }
  label {
    flex: 1;
    height: 100%;
    line-height: ${dimensions.itemHeight};
  }
`;
