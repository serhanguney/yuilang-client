import React from 'react';

export default class ErrorPage extends React.Component<any, any> {
  render() {
    return <h1>You encountered an error {this.props.message && this.props.message}</h1>;
  }
}
