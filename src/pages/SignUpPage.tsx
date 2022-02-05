import * as React from 'react';
import { connect } from 'react-redux';
interface SignUpPageState {
	email: string;
	password: string;
}

class SignUpPage extends React.Component<any, SignUpPageState> {
	constructor(props: any) {
		super(props);
		this.state = {
			email: '',
			password: ''
		};
		this.handleInputChange = this.handleInputChange.bind(this);
	}
	handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
		this.setState({
			...this.state,
			[e.target.name]: e.target.value
		});
	}

	handleSignUp() {}
	render() {
		return (
			<div>
				<h1>SIGNUP</h1>
				<input type={'text'} name={'email'} onChange={(e) => this.handleInputChange(e)} />
				<input type={'text'} name={'password'} onChange={(e) => this.handleInputChange(e)} />
				<button onClick={this.handleSignUp.bind(this)}>Click to signup</button>
			</div>
		);
	}
}

const mapStateToProps = (state: any) => {
	return {
		isLoggedIn: state.isLoggedIn
	};
};
export default connect(mapStateToProps)(SignUpPage);
