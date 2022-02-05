import * as React from 'react';
import { connect } from 'react-redux';

import { RootState } from '../redux/reducer';
import { ReducerState as ContentType } from '../redux/content';
import { Identity, retrieveIdentity } from '../redux/identity';
import { getUserData } from '../redux/content';
import {
	CONTENT_FAILED,
	CONTENT_RECEIVED,
	CONTENT_REQUESTED,
	IDENTITY_FAILED,
	IDENTITY_IDLE,
	IDENTITY_RECEIVED,
	IDENTITY_REQUESTED
} from '../redux/constants';

import Loading from './Loading';
import { Redirect } from 'react-router-dom';
import { history } from '../index';
import { LOGIN_PAGE_URL, arrayOfPrivateURLs } from '../utils/constants';

interface AuthenticationBoundaryProps {
	getUserData: Function;
	retrieveIdentity: Function;
	children?: any;
	dispatch?: any;
	user: Identity;
	content: ContentType;
}

class AuthenticationBoundary extends React.Component<AuthenticationBoundaryProps, any> {
	render() {
		const isAuthorisationNeeded = arrayOfPrivateURLs.some((url) => history.location.pathname.includes(url));
		if (!isAuthorisationNeeded) {
			return null;
		}

		const {
			user: { uid, identityStatus },
			content: { contentStatus },
			retrieveIdentity,
			getUserData
		} = this.props;

		const isAuthorised = identityStatus === IDENTITY_RECEIVED && contentStatus === CONTENT_RECEIVED;
		const hasAuthorisationFailed = identityStatus === IDENTITY_FAILED || contentStatus === CONTENT_FAILED;
		const isLoading = identityStatus === IDENTITY_REQUESTED || contentStatus === CONTENT_REQUESTED;
		if (isLoading) {
			return <Loading />;
		}
		if (isAuthorised) {
			return this.props.children;
		}

		if (identityStatus === IDENTITY_IDLE) {
			return <Loading load={retrieveIdentity} message={'retrieving identity'} />;
		} else if (uid && !hasAuthorisationFailed && contentStatus !== CONTENT_REQUESTED) {
			return <Loading load={() => getUserData(uid)} message={'retrieving data'} />;
		} else {
			return <Redirect to={LOGIN_PAGE_URL} />;
		}
	}
}

const actionCreators = {
	getUserData,
	retrieveIdentity
};

const mapStateToProps = (state: RootState) => {
	return {
		user: state.user,
		content: state.content
	};
};

export default connect(mapStateToProps, actionCreators)(AuthenticationBoundary);
