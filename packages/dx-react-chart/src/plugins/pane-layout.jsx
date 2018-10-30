import * as React from 'react';
import * as PropTypes from 'prop-types';
import {
  Plugin,
  Getter,
  Template,
  TemplateConnector,
  TemplatePlaceholder,
  Sizer,
} from '@devexpress/dx-react-core';

const makeMounterAndConnector = () => {
  let instance = null;
  const elements = new Set();
  const notify = () => {
    if (instance) {
      instance.setItems(Array.from(elements));
    }
  };

  // eslint-disable-next-line react/no-multi-comp
  class DefsMounter extends React.PureComponent {
    constructor(props) {
      super(props);
      instance = this;
      this.state = {
        items: [],
      };
    }

    componentWillUnmount() {
      instance = null;
    }

    setItems(items) {
      this.setState({ items });
    }

    render() {
      const { items } = this.state;
      return <defs>{items}</defs>;
    }
  }

  // eslint-disable-next-line react/no-multi-comp
  class DefsConnector extends React.PureComponent {
    constructor(props) {
      super(props);
      const { children } = props;
      elements.add(children);
      notify();
    }

    componentWillUnmount() {
      const { children } = this.props;
      elements.delete(children);
      notify();
    }

    render() {
      return null;
    }
  }

  DefsConnector.propTypes = {
    children: PropTypes.node.isRequired,
  };

  return [DefsMounter, DefsConnector];
};

// eslint-disable-next-line react/no-multi-comp
export class PaneLayout extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      width: 800,
      height: 600,
    };

    const [mounterComponent, connectorComponent] = makeMounterAndConnector();
    this.mounterComponent = mounterComponent;
    this.connectorComponent = connectorComponent;
  }

  handleSizeUpdate({ width, height }, changeBBox) {
    this.setState({ width, height });
    changeBBox({ placeholder: 'pane', bBox: { width, height } });
  }

  render() {
    const {
      width,
      height,
    } = this.state;

    const DefsMounter = this.mounterComponent;

    return (
      <Plugin name="PaneLayout">
        <Getter name="defsConnectorComponent" value={this.connectorComponent} />
        <Template name="canvas">
          {params => (
            <TemplateConnector>
              {(_, { changeBBox }) => (
                <Sizer
                  style={{ flex: 1, zIndex: 1 }}
                  onSizeChange={size => this.handleSizeUpdate(size, changeBBox)}
                >
                  <div style={{ width: '100%' }}>
                    <svg
                      {...params}
                      width={width}
                      height={height}
                      style={{
                        position: 'absolute', left: 0, top: 0, overflow: 'visible',
                      }}
                    >
                      <DefsMounter />
                      <TemplatePlaceholder name="series" />
                    </svg>
                  </div>
                </Sizer>
              )}
            </TemplateConnector>
          )}
        </Template>
      </Plugin>
    );
  }
}
