import React from 'react';
import styled from 'styled-components';
import { Tag } from '../../../design/components/Tag';
import { spaces, colors } from '../../../design/fixedValues';

const OptionsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  border-bottom: 2px solid ${colors.secondary};
  padding: ${spaces.small} 0;
`;
const customTagStyle = {
  width: '40%',
};
class ChooseLanguage extends React.Component<any, any> {
  render(): JSX.Element {
    return (
      <OptionsContainer>
        <Tag as={'button'} appearance={'regular'} selected={false} name={'Czech'} style={customTagStyle}>
          {this.props.from}
        </Tag>
        <Tag onClick={this.props.handleSwitch} appearance={'regular'} selected={false} style={{ width: '20%' }}>
          Switch
        </Tag>
        <Tag as={'button'} appearance={'regular'} selected={false} name={'English'} style={customTagStyle}>
          {this.props.to}
        </Tag>
      </OptionsContainer>
    );
  }
}

export default ChooseLanguage;
