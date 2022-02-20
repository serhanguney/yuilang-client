import * as React from 'react';

export default class Loading extends React.Component<any> {
  componentDidMount() {
    if (this.props.load) {
      this.props.load();
    }
  }

  componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<{}>, snapshot?: any) {
    if (this.props.load && prevProps.load !== this.props.load) {
      this.props.load();
    }
  }

  render() {
    return <div>Loading...</div>;
  }
}
