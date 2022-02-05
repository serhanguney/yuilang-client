import styled from 'styled-components';
import { colors, spaces } from '../fixedValues';

export const Navbar = styled.nav`
	display: flex;
	padding: ${spaces.medium};
	justify-content: space-between;
	margin-bottom: ${spaces.small};
	h2 {
		color: ${colors.black};
		font-weight: 600;
		font-size: 18px;
		margin: 0;
	}
`;

export const NavbarActions = styled.div`
	display: flex;
`;
