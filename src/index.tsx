import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Switch, Route, Router as BrowserRouter, Redirect } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import AuthenticationBoundary from './components/AuthenticationBoundary';

import { GlobalStyle, theme } from './design/theme';

import DefaultLayout from './pages/DefaultLayout';
import { LOGIN_PAGE_URL, SIGNUP_PAGE_URL } from './utils/constants';
import LogInPage from './pages/LogInPage';
import SignUpPage from './pages/SignUpPage';
import ErrorPage from './pages/ErrorPage';

export const history = createBrowserHistory();

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter history={history}>
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        <AuthenticationBoundary>
          <DefaultLayout />
        </AuthenticationBoundary>
        <Switch>
          <Route path={'/'} render={() => <Redirect to={LOGIN_PAGE_URL} />} exact />
          <Route path={'/error'} component={ErrorPage} />
          <Route path={LOGIN_PAGE_URL} component={LogInPage} exact />
          <Route path={SIGNUP_PAGE_URL} component={SignUpPage} exact />
        </Switch>
      </ThemeProvider>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);
