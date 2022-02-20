import * as React from 'react';
import { Route, withRouter, Switch } from 'react-router-dom';

import { HOME_PAGE_URL } from '../utils/constants';
import Dashboard from '../components/DefaultLayout/Dashboard';

class DefaultLayout extends React.Component<any, any> {
  render() {
    return (
      <Switch>
        <Route path={HOME_PAGE_URL} component={Dashboard} />
      </Switch>
    );
  }
}

export default withRouter(DefaultLayout);
