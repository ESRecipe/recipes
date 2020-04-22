'use strict';
const unified = require(`unified`)
const remarkMdx = require(`remark-mdx`)
const remarkParse = require(`remark-parse`)
const remarkStringify = require(`remark-stringify`)
const React = require('react');
const PropTypes = require('prop-types');
const {Text, Color, Box} = require('ink');
const {MDXProvider} = require('@mdx-js/react');
const MDX = require('@mdx-js/runtime');
const fs = require('fs');

const MDXContent = fs.readFileSync('./hello.mdx', 'utf8');

// Markdown ignores new lines and so do we.
function eliminateNewLines(children) {
  return React.Children.map(children, child => {
    if (!React.isValidElement(child)) {
      return child.replace(/(\r\n|\n|\r)/gm, ` `)
    }

    if (child.props.children) {
      child = React.cloneElement(child, {
        children: eliminateNewLines(child.props.children),
      })
    }

    return child
  })
}

const u = unified().use(remarkParse).use(remarkStringify).use(remarkMdx);
const partitionSteps = ast => {
  const steps = []
  let index = 0
  ast.children.forEach(node => {
    if (node.type === `thematicBreak`) {
      index++
      return undefined
    }

    steps[index] = steps[index] || []
    steps[index].push(node)
    return undefined
  })

  return steps
}
const ast = u.parse(MDXContent);

console.log(partitionSteps(ast));

const components = {
  inlineCode: props => <Text {...props} />,
  h1: ({children}) => <Text bold>{children}</Text>,
  h3: ({children}) => (
    <Text bold italic>
      {children}
    </Text>
  ),
  a: ({ href, children }) => <Link url={href}>{children}</Link>,
  strong: props => <Text bold {...props} />,
  em: props => <Text italic {...props} />,
  p: props => {
    const children = eliminateNewLines(props.children)
    return (
      <Box marginBottom={1}>
        <Text>{children}</Text>
      </Box>
    )
  },
  Text,
  Color,
  Box,
  File: () => null,
};

const App = ({name}) => (
  <MDXProvider components={components}>
    <Text>
      Hello, <Color green>{name}</Color>
    </Text>
    <MDX>{MDXContent}</MDX>
  </MDXProvider>
);

App.propTypes = {
  name: PropTypes.string
};

App.defaultProps = {
  name: 'Stranger'
};

module.exports = App;
