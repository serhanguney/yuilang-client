import styled from 'styled-components';
import { colors, spaces, measures } from '../fixedValues';

interface YuiTitleProps {
	hasFullLength: boolean;
}

export const YuiTitle = styled.div<YuiTitleProps>`
	position: relative;
	padding: 30px ${(props) => (props.hasFullLength ? 0 : spaces.medium)};
	display: flex;
	justify-content: center;
	opacity: ${measures.lowOpacity};
	p {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		margin: 0;
		color: ${colors.primary};
		background-color: ${colors.white};
		padding: 0 3px;
		font-weight: ${measures.thinFontWeight};
		letter-spacing: 0;
		span {
			font-weight: ${measures.thickFontWeight};
		}
	}
`;

export const YuiTitleLine = styled.span<YuiTitleProps>`
	flex-grow: ${(props) => (props.hasFullLength ? 1 : 0.8)};
	height: 1px;
	background-color: ${colors.primary};
`;
