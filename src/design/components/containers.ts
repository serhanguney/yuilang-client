import styled from 'styled-components';
import { colors, measures, spaces, dimensions } from '../fixedValues';

export const MainSection = styled.div`
	display: flex;
	flex-direction: column;
	flex-grow: 1;
  height: 100%;
  
`;

export const SectionContainer = styled.div<{ isTopLevel?: boolean; isCentered?: boolean }>`
	display: flex;
	flex-direction: column;
	justify-content: ${(props) => (props.isCentered ? 'center' : '')};
	align-items: ${(props) => (props.isCentered ? 'center' : '')};
	margin-bottom: ${spaces.large};
	border-radius: ${measures.borderRadius};
	z-index: ${(props) => (props.isTopLevel ? measures.zFirstLevel : 0)};
	box-shadow: ${(props) => (props.isTopLevel ? measures.boxShadow : '')};
	background-color: ${colors.white};
`;

export type ContainerSizes = 'small' | 'medium' | 'large';

export const CircleContainer = styled.div<{ size: ContainerSizes }>`
	width: ${(props) => dimensions[props.size]};
	height: ${(props) => dimensions[props.size]};
`;
export const CategoryContainer = styled.div`
	padding: ${spaces.medium} 0px ${spaces.medium} 4px;
`;

export const InfoContainer = styled.div<{ flex?: boolean; column?: boolean }>`
	padding: ${spaces.small} ${spaces.large};
	display: ${({ flex }) => (flex ? 'flex' : 'block')};
	flex-direction: ${({ column }) => (column ? 'column' : 'row')};
	justify-content: space-between;
`;
export const TextContainer = styled.div`
	display: flex;
	flex-direction: column;
`;
