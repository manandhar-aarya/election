import React from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from '../routes';

export default () => {
  return (
    <Menu style={{ marginTop: '16px' }}>
      <Link route="/">
        <a className="item">Elections</a>
      </Link>

      <Menu.Menu position="right">
        <Link route="/profile">
          <a className="item">My Tokens</a>
        </Link>

        <Link route="/elections/new">
          <a className="item">+</a>
        </Link>
      </Menu.Menu>
    </Menu>
  );
};
