import styled from 'styled-components';
import CircleProgress from '../../components/CircleProgress';
import { CircleContainer, InfoContainer, TextContainer } from './containers';
import { colors, measures, spaces } from '../fixedValues';

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

const InfoLine = ({ heading, description, count, percentage }: ILine) => {
  return (
    <InfoContainer flex={true}>
      <TextContainer>
        <Text>{heading}</Text>
        <SubText>{description}</SubText>
        <SubText>Total: {count}</SubText>
      </TextContainer>
      <CircleContainer size={'small'}>
        <CircleProgress appearance={'submit'} percentage={percentage} size={'small'} />
      </CircleContainer>
    </InfoContainer>
  );
};

export default InfoLine;
