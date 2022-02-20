import * as React from 'react';
import { YuiTitle, YuiTitleLine } from '../../design/components/YuiTitle';
import { Navbar, NavbarActions } from '../../design/components/Navbar';
import {MainSection} from '../../design/components/containers';
import SectionBar from './NavigationBar';
import { Route } from 'react-router-dom';
import { HOME_PAGE_URL } from '../../utils/constants';
import SectionsBoundary from './NavigationsBoundary';

export default class Dashboard extends React.Component {
	render() {
		return (
			<MainSection>
				<Navbar>
					<h2>YuiLang</h2>
					<NavbarActions>
						<p style={{ margin: 0 }}>menu</p>
					</NavbarActions>
				</Navbar>
				<SectionBar />
				<Route path={`${HOME_PAGE_URL}/:sectionId`} component={SectionsBoundary} exact />
				<YuiTitle hasFullLength={true}>
					<p>
						Product of <span>Yuivae</span>
					</p>
					<YuiTitleLine hasFullLength={false} />
				</YuiTitle>
			</MainSection>
		);
	}
}
