/* eslint-disable import/no-anonymous-default-export */
import React, { Component, cloneElement } from 'react';
import { Route, Redirect } from 'react-router-dom';
// Utils
import { has, isValidComp } from './Utils';

/**
  * @param {Object} structure - The passed object that defines the routes.
  * @param {boolean} structure.isAuthenticated - [Required] in order to differentiate between LoggedIn/Loggedout users
  * @param {object} [structure.anonymousStructure] - it's an object that has only [ routes ] array, [ these routes available for All personas ] 
  * @param {object} [structure.authorizedStructure] - it's an object that has [ fallbackPath: {string}, routes: {array} ], fallbackPath: is used for redirect when a logged [in] user tried to access unAuthorized route, routes: only The Logged [in] Routes Available
  * @param {object} [structure.unAuthorizedStructure] - it's an object that has [ fallbackPath: {string}, routes: {array} ], fallbackPath: is used for redirect when a logged [out] user tried to access route that requires [Authorization] , routes: only The Logged [out] Routes Available
  * @param {component} [fallbackComponent] - in order to redirect in all cases if the route doesn't match.
  * @returns {Array}
*/

export default structure => {
  const {
    isAuthenticated = false,
    anonymousStructure = {},
    authorizedStructure = {},
    unAuthorizedStructure = {},
    fallbackComponent = Component
  } = structure || {};

  const dynamicRoutes = [];

  if (has(structure, 'anonymousStructure')) {
    dynamicRoutes.push(...routesGenerator(isAuthenticated, anonymousStructure, 'anonymous'));
  }

  if (has(structure, 'authorizedStructure')) {
    dynamicRoutes.push(...routesGenerator(isAuthenticated, authorizedStructure, 'authorized'));
  }

  if (has(structure, 'unAuthorizedStructure')) {
    dynamicRoutes.push(...routesGenerator(isAuthenticated, unAuthorizedStructure, 'unAuthorized'));
  }

  // Fallback Routes
  if (fallbackComponent && isValidComp(fallbackComponent)) {
    const notFoundRoute = <Route render={props => cloneElement(fallbackComponent, { key: 'fallback', ...props })} />;

    dynamicRoutes.push(notFoundRoute);
  }

  return dynamicRoutes;
};

/**
 * path: string
 * component: React.Component
 * routeProps: Object -----> To override route props
 * redirectPath: String ----> To redirect to specific location
 * showRouteIf: to override when to show the component or when to [ Redirect ]
 */
const routesGenerator = (isAuthenticated = false, routeSet = {}, type = 'anonymous') => {
  const generatedRoutes = [];
  const { fallbackPath = '' } = routeSet || {};

  const isAnonymous = type === 'anonymous';
  const isAuthorized = type === 'authorized';
  // const isUnAuthorized = type === 'unAuthorized';

  if (has(routeSet, 'routes')) {
    const setRoutes = routeSet.routes;
    if (Array.isArray(setRoutes) && setRoutes.length > 0) {
      setRoutes.forEach((route, index) => {
        const {
          path = '',
          component,
          routeProps = {},
          redirectPath = '',
          showRouteIf = true
        } = route || {};
        // Show Route only [ in The list ] if this prop is true 
        if (showRouteIf) {
          // check the mandatory props for a routes
          if (!path || !isValidComp(component)) {
            console.warn(`A [route] is skipped because one of the following, 1/ No valid [path] prop provided for the route, 2/ No valid [component] provided for the route`);
          } else {

            const renderCondition = (isAuthorized ? isAuthenticated : !isAuthenticated);
            // In case of Anonymous Routes ===> Just generate without Any Logic
            if (isAnonymous) {
              return generatedRoutes.push(
                <Route
                  exact
                  key={`${path}_${index}`}
                  path={path}
                  render={props => cloneElement(component, { ...props })}
                  {...routeProps}
                />
              );
            }

            return generatedRoutes.push(
              <Route
                exact
                key={`${route.path}_${index}`}
                path={route.path}
                render={props => {
                  return renderCondition ? cloneElement(component, { ...props }) : <Redirect to={redirectPath || fallbackPath} />;
                }}
              />
            );
          }
        }
      });
    }
  } else {
    console.warn(`[routes] prop can't be found in ${type}Structure Object`);
  }

  return generatedRoutes;
};
