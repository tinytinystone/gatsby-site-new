import React, { Component } from 'react';
import Header from './Header';
import s from './Layout.module.scss';

export default class Layout extends Component {
  render() {
    return (
      <div className={`${s.wrapper} ${this.props.className}`}>
        <Header props="props" />
        <main className={s.main}>{this.props.children}</main>
      </div>
    );
  }
}
