import * as React from 'react';
import * as PropTypes from 'prop-types';
import { getAreaAnimationStyle } from '@devexpress/dx-chart-core';

export class Area extends React.PureComponent {
  render() {
    const {
      defsConnectorComponent: Defs,
      path,
      coordinates,
      color,
      style,
      getAnimatedStyle,
      scales,
      ...restProps
    } = this.props;
    const patternId = color.substr(1);
    const pattern = (
      <Defs>
        <pattern id={patternId} width="6" height="6" patternUnits="userSpaceOnUse">
          <rect x="0" y="0" width="6" height="6" fill={color} opacity="0.75" />
          <path d="M 3 -3 L -3 3 M 0 6 L 6 0 M 9 3 L 3 9" strokeWidth="2" stroke={color} />
        </pattern>
      </Defs>
    );
    const element = (
      <path
        d={path(coordinates)}
        fill={`url(#${patternId})`}
        style={getAnimatedStyle(style, getAreaAnimationStyle, scales)}
        {...restProps}
      />
    );
    return (
      <React.Fragment>
        {pattern}
        {element}
      </React.Fragment>
    );
  }
}

Area.propTypes = {
  path: PropTypes.func.isRequired,
  coordinates: PropTypes.array.isRequired,
  color: PropTypes.string,
  style: PropTypes.object,
};

Area.defaultProps = {
  color: undefined,
  style: undefined,
};
