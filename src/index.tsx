import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Switch, Route, Router as BrowserRouter, Redirect } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { GlobalStyle, theme } from './design/theme';

import { HOME_PAGE_URL, LOGIN_PAGE_URL, SIGNUP_PAGE_URL } from './utils/constants';
import LogInPage from './pages/LogInPage';
import SignUpPage from './pages/SignUpPage';
import ErrorPage from './pages/ErrorPage';
import Dashboard from './components/DefaultLayout/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import ModalBoundary from './components/ModalBoundary';

export const history = createBrowserHistory();

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter history={history}>
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        <ModalBoundary>
          <Switch>
            <PrivateRoute path={HOME_PAGE_URL} component={Dashboard} />
            <Route path={'/'} render={() => <Redirect to={LOGIN_PAGE_URL} />} exact />
            <Route path={'/error'} component={ErrorPage} />
            <Route path={LOGIN_PAGE_URL} component={LogInPage} exact />
            <Route path={SIGNUP_PAGE_URL} component={SignUpPage} exact />
          </Switch>
        </ModalBoundary>
      </ThemeProvider>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);
