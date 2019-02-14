import React, { Component } from 'react';
import Header from './Header';
import './Layout.scss';

export default class Layout extends Component {
  render() {
    return (
      <div className="wrapper">
        <Header props="props" />
        <main className="main">{this.props.children}</main>
      </div>
    );
  }
}
