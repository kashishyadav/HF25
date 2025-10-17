import React from 'react';
import PropTypes from 'prop-types';
import './Display.css';

const Display = ({ value, steps }) => (
  <div className="display-container">
    <div className="steps">{steps}</div>
    <div className="display">{value}</div>
  </div>
);

Display.propTypes = {
  value: PropTypes.string.isRequired,
  steps: PropTypes.string.isRequired,
};

export default Display;
