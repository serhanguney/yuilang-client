import * as React from 'react';
import { connect } from 'react-redux';
import { initialiseLogin } from '../redux/identity';
import UserInput from "../design/components/Input";
import {Button, ButtonContainer} from "../design/components/buttons";
import {SectionContainer} from "../design/components/containers";
import styled from 'styled-components';
import {spaces} from "../design/fixedValues";
import {YuiTitle, YuiTitleLine} from "../design/components/YuiTitle";

const StyledContainer = styled(SectionContainer)`
	padding: ${spaces.large} ${spaces.small};
	height: 100%;
	h1{
		text-align: center;
	}
`
const StyledTitle = styled(YuiTitle)`
	margin-top: auto;
`
interface LoginPageState {
	email: string;
	password: string;
}

class LogInPage extends React.Component<any, LoginPageState> {
	constructor(props: any) {
		super(props);
		this.state = {
			email: '',
			password: ''
		};
	}

	handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		this.setState({
			...this.state,
			[e.target.name]: e.target.value
		});
	}
	handleSubmit(e: any) {
		e.preventDefault();
		this.props.initialiseLogin({ email: this.state.email, password: this.state.password });
	}
	render() {
		return (
			<StyledContainer>
				<form aria-labelledby={'login-form-title'} onSubmit={e => this.handleSubmit(e)}>
					<h1 id={'login-form-title'}>Login form</h1>
					<UserInput
						type={'text'}
						value={this.state.email}
						onChange={(e:React.ChangeEvent<HTMLInputElement>) => this.handleChange(e)}
						name={'email'}
						aria-label={'email'}
					/>
					<UserInput
						type={'password'}
						value={this.state.password}
						onChange={(e:React.ChangeEvent<HTMLInputElement>) => this.handleChange(e)}
						name={'password'}
						aria-label={'password'}
					/>
					<ButtonContainer>
						<Button appearance={'button'} type={'submit'}>Login</Button>
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
	initialiseLogin
};
export default connect(undefined, actionCreators)(LogInPage);
