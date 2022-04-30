import * as React from 'react';
import { YuiTitle, YuiTitleLine } from '../../design/components/YuiTitle';
import { Navbar } from '../../design/components/Navbar';
import { MainSection } from '../../design/components/containers';
import SectionBar from './NavigationBar';
import { Route } from 'react-router-dom';
import { HOME_PAGE_URL } from '../../utils/constants';
import SectionsBoundary from './NavigationsBoundary';
import styled from 'styled-components';

const StyledMainSections = styled(MainSection)`
  margin-bottom: 100px;
`;
export default class Dashboard extends React.Component {
  render() {
    return (
      <StyledMainSections>
        <Navbar>
          <h2>YuiLang</h2>
        </Navbar>
        <SectionBar />
        <Route path={`${HOME_PAGE_URL}/:sectionId`} component={SectionsBoundary} exact />
        <YuiTitle hasFullLength={true}>
          <p>
            Product of <span>Yuivae</span>
          </p>
          <YuiTitleLine hasFullLength={false} />
        </YuiTitle>
      </StyledMainSections>
    );
  }
}
