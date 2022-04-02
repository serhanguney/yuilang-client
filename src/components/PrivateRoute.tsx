import * as React from 'react';
import { connect } from 'react-redux';
import { LOCAL_STORAGE_UID_KEY, LOGIN_PAGE_URL } from '../utils/constants';
import { Redirect, Route } from 'react-router-dom';
import { getUserData, ReducerState } from '../redux/content';
import { DatabaseModel } from '../conf/dataModel';

interface IPrivateRoute {
  getUserData: (uid: string) => void;
  component: any;
  path: string;
  content: ReducerState;
}
class PrivateRoute extends React.Component<IPrivateRoute, { isAuthorised: boolean; needsLogin: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = {
      isAuthorised: false,
      needsLogin: false,
    };
  }
  async validateUser(uid: string) {
    await this.props.getUserData(uid);
  }

  componentDidMount() {
    const uid = localStorage.getItem(LOCAL_STORAGE_UID_KEY);
    if (uid) {
      try {
        this.validateUser(uid);
      } catch (e) {
        this.setState({ needsLogin: true });
      }
    } else {
      this.setState({ needsLogin: true });
    }
  }

  render() {
    const { component, path, content } = this.props;

    if ((content.userContent as DatabaseModel).categories) {
      return <Route path={path} component={component} />;
    } else if (this.state.needsLogin) {
      return <Redirect to={LOGIN_PAGE_URL} />;
    } else {
      return null;
    }
  }
}

const mapStateToProps = (state: any) => {
  return {
    content: state.content,
  };
};
const actionCreators = {
  getUserData,
};
export default connect(mapStateToProps, actionCreators)(PrivateRoute);
