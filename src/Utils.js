import React from 'react';

export const isValidComp = comp => React.isValidElement(comp);

export const has = (obj, prop) => obj.hasOwnProperty(prop);
