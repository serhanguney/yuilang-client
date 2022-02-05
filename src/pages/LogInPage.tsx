import * as React from 'react';
import { connect } from 'react-redux';
import { initialiseLogin } from '../redux/identity';
import { StyledButton } from 'yuivae';

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
			<div>
				<form aria-labelledby={'login-form-title'}>
					<h1 id={'login-form-title'}>Login form</h1>
					<input
						type={'text'}
						value={this.state.email}
						onChange={(e) => this.handleChange(e)}
						name={'email'}
						aria-label={'email'}
					/>
					<input
						type={'password'}
						value={this.state.password}
						onChange={(e) => this.handleChange(e)}
						name={'password'}
						aria-label={'password'}
					/>
					<StyledButton>OK</StyledButton>
					<button onClick={(e) => this.handleSubmit(e)}>Login</button>
				</form>
			</div>
		);
	}
}

const actionCreators = {
	initialiseLogin
};
export default connect(undefined, actionCreators)(LogInPage);
