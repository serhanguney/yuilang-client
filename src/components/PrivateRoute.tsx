import * as React from 'react';
import { connect } from 'react-redux';
import { LOGIN_PAGE_URL } from '../utils/constants';
import { IDENTITY_FAILED } from '../redux/constants';
import { Redirect, Route } from 'react-router-dom';

class PrivateRoute extends React.Component<any, any> {
	render() {
		const { component, user, path } = this.props;
		if (user.identityStatus === IDENTITY_FAILED) {
			return <Redirect to={LOGIN_PAGE_URL} />;
		} else {
			return <Route path={path} component={component} />;
		}
	}
}

const mapStateToProps = (state: any) => {
	return {
		user: state.user
	};
};

export default connect(mapStateToProps)(PrivateRoute);
