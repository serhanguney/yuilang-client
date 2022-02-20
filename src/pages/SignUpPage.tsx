import * as React from 'react';
import { connect } from 'react-redux';
import UserInput from '../design/components/Input';
import { Button, ButtonContainer } from '../design/components/buttons';
import { YuiTitle, YuiTitleLine } from '../design/components/YuiTitle';
import styled from 'styled-components';
import { SectionContainer } from '../design/components/containers';
import { spaces } from '../design/fixedValues';
import { initialiseSignup } from '../redux/signup';

const StyledContainer = styled(SectionContainer)`
  padding: ${spaces.large} ${spaces.small};
  height: 100%;
  h1 {
    text-align: center;
  }
`;
const StyledTitle = styled(YuiTitle)`
  margin-top: auto;
`;

interface SignUpPageState {
  email: string;
  password: string;
}

class SignUpPage extends React.Component<any, SignUpPageState> {
  constructor(props: any) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      ...this.state,
      [e.target.name]: e.target.value,
    });
  }

  handleSubmit(e: any) {
    e.preventDefault();
    this.props.initialiseSignup({
      email: this.state.email,
      password: this.state.password,
    });
  }

  render() {
    return (
      <StyledContainer>
        <form aria-labelledby={'login-form-title'} onSubmit={(e) => this.handleSubmit(e)}>
          <h1 id={'login-form-title'}>Signup form</h1>
          <UserInput
            type={'text'}
            value={this.state.email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.handleChange(e)}
            name={'email'}
            aria-label={'email'}
          />
          <UserInput
            type={'password'}
            value={this.state.password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.handleChange(e)}
            name={'password'}
            aria-label={'password'}
          />
          <ButtonContainer>
            <Button appearance={'button'} type={'submit'}>
              Signup
            </Button>
          </ButtonContainer>
        </form>
        <StyledTitle hasFullLength={true}>
          <p>
            Product of <span>Yuivae</span>
          </p>
          <YuiTitleLine hasFullLength={false} />
        </StyledTitle>
      </StyledContainer>
    );
  }
}

const actionCreators = {
  initialiseSignup,
};
export default connect(undefined, actionCreators)(SignUpPage);
