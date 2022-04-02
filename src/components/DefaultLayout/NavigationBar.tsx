import * as React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { PRACTICE_SECTION, VOCABULARY_SECTION } from '../../utils/constants';

import { Tag } from '../../design/components/Tag';
import { spaces } from '../../design/fixedValues';
import styled from 'styled-components';
import { HOME_PAGE_URL } from '../../utils/constants';

const sections = [PRACTICE_SECTION, VOCABULARY_SECTION];

const SectionBarContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin: 0 auto ${spaces.large} auto;
`;

const customTagStyle = {
  margin: 0,
};
class NavigationBar extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    const getSectionFromUrl = this.props.history.location.pathname.split('/').slice(1)[1];

    this.state = {
      currentSection: getSectionFromUrl,
    };
  }

  handleClick(section: string) {
    this.setState({
      ...this.state,
      currentSection: section,
    });
  }

  render(): JSX.Element {
    return (
      <>
        <SectionBarContainer>
          {sections.map((section, index) => (
            <Tag
              key={index}
              appearance={'regular'}
              selected={section.toLowerCase() === this.state.currentSection}
              style={customTagStyle}
            >
              <Link
                to={`${HOME_PAGE_URL}/${section.toLowerCase()}`}
                onClick={() => this.handleClick(section.toLowerCase())}
              >
                {section}
              </Link>
            </Tag>
          ))}
        </SectionBarContainer>
      </>
    );
  }
}

export default withRouter(NavigationBar);
