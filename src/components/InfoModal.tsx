import styled, { css, keyframes } from 'styled-components';
import { connect } from 'react-redux';
import { useEffect, useState } from 'react';
import { promptInfoModal } from '../redux/infoModal';
import { colors, measures, spaces } from '../design/fixedValues';

interface IContainer {
  type: 'empty' | 'error' | 'info';
}
const appearAnimation = keyframes`
  from{
    opacity: 0;
    top: 17%
  }
  to{
    opacity: 1;
    top: 15%
  }
`;

const InfoModalContainer = styled.div<IContainer>`
  position: fixed;
  top: 15%;
  left: 50%;

  width: 80%;
  max-width: 500px;
  padding: ${spaces.small} ${spaces.medium};
  border-radius: ${measures.borderRadius};
  box-shadow: 10px 10px 12px rgba(0, 0, 0, 0.3);

  transform: translateX(-50%);
  animation: ${appearAnimation} 250ms ease-in-out;
  ${({ type, theme }) => {
    if (type === 'error') {
      return css`
        background-color: ${theme.getAppearanceColor('cancel', 'background')};
        color: ${theme.getAppearanceColor('cancel', 'text')};
      `;
    } else {
      return css`
        background-color: ${theme.getAppearanceColor('regular', 'background')};
        color: ${theme.getAppearanceColor('regular', 'text')};
      `;
    }
  }}
`;

const InfoModal = ({ type, message, promptInfoModal }: any) => {
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (message) {
      timer = setTimeout(() => {
        promptInfoModal({ type: 'empty', message: '' });
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [message]);
  return (
    <InfoModalContainer type={type}>
      <p>{message}</p>
    </InfoModalContainer>
  );
};

const mapStateToProps = (state: any) => ({
  infoModal: state.infoModal,
});
const actionCreators = {
  promptInfoModal,
};
export default connect(mapStateToProps, actionCreators)(InfoModal);
