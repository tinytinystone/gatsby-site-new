import React, { Component } from 'react';
import Header from './Header';
import './Layout.css';

export default class Layout extends Component {
  render() {
    return (
      <React.Fragment>
        <Header />
        <main className="main">{this.props.children}</main>
        <footer className="footer">© 2018 PUFFIN</footer>
      </React.Fragment>
    );
  }
}
