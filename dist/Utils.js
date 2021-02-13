import React from 'react';
export const isValidComp = comp => /*#__PURE__*/React.isValidElement(comp);
export const has = (obj, prop) => obj.hasOwnProperty(prop);