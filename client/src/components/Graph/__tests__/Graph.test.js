import React from 'react';
import ReactDOM from 'react-dom';
import Graph from '..';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Graph />, div);
  ReactDOM.unmountComponentAtNode(div);
});
