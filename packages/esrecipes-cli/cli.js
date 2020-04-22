#!/usr/bin/env node
'use strict';
const React = require('react');
const importJsx = require('import-jsx');
const {render} = require('ink');
const meow = require('meow');

const ui = importJsx('./ui');

const cli = meow(
  `
	Usage
	  $ cli

	Options
		--name or -n Your name

	Examples
	  $ cli --name=Jane
	  Hello, Jane
`,
  {
    flags: {
      name: {
        type: 'string',
        alias: 'n'
      }
    }
  }
);

render(React.createElement(ui, cli.flags));
