import styled from 'styled-components';
import CircleProgress from '../../components/CircleProgress';
import { CircleContainer, InfoContainer, TextContainer } from './containers';
import { colors, measures, spaces } from '../fixedValues';
import React from 'react';

const Text = styled.p`
  margin: 0 0 ${spaces.tiny} 0;
  color: ${colors.black};
`;

const SubText = styled.p`
  color: ${colors.primary};
  opacity: 0.6;
  font-weight: ${measures.thinFontWeight};
  margin: 0;
  font-size: ${measures.smallFontSize};
`;

interface ILine {
  heading: string;
  description: string;
  count?: number;
  percentage?: number;
}

const InfoLine: React.FC<ILine> = ({ heading, description, count, percentage, children }) => {
  return (
    <InfoContainer flex>
      <TextContainer>
        <Text>{heading}</Text>
        <SubText>{description}</SubText>
        {count && <SubText>Total: {count}</SubText>}
      </TextContainer>
      {Number.isInteger(percentage) && (
        <CircleContainer size={'small'}>
          <CircleProgress appearance={'submit'} percentage={percentage} size={'small'} />
        </CircleContainer>
      )}
      {children}
    </InfoContainer>
  );
};

export default InfoLine;
