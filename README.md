# Description
A React utility that is made to:
1. Handle the protected routes Logic **with fully control over rendered route**.
2. ensure that is the only allowed persona can access his specified routes.
3. Handle redirection
   1. prevent login user to access route that not require authentication and viceversa.

### You can play with [Demo](https://codesandbox.io/s/protected-react-routes-generator-demos-yuxvc) from here 

# Example
```javascript
import React from 'react';
import { Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
// Utility
import RoutesConfiguration from 'protected-react-routes-generator';
// Routes
import CoursePayment from '../Payment/Course';
import PaymentResult from '../Payment/PaymentResult';
import Login from '../Screens/Login';
import SignUp from '../Screens/SignUp';
import Home from '../components/pages/Home';
import Faqs from '../components/pages/Faqs';
import PageNotFound from '../components/pages/pageNotFound';

function AppNavigation({ auth }) {
    const authorizedStructure = {
    fallbackPath: '/login',
    routes: [
      { path: '/payment/result', component: <PaymentResult /> },
      { path: '/course-payment/:id', component: <CoursePayment /> },
    ]
  };

  const unAuthorizedStructure = {
    fallbackPath: '/dashboard',
    routes: [
      { path: '/signup', component: <SignUp /> },
      { path: '/login/:resetAvailable?', component: <Login /> },
    ]
  };

  const anonymousStructure = {
    routes: [
      { path: '/', component: <Home /> },
      { path: '/home', component: <Home /> },
      { path: '/faqs', component: <Faqs /> },
      { path: '/404', component: <PageNotFound /> },
    ]
  };

  return(
    <ConnectedRouter history={history}>
      <Switch>
        {RoutesConfiguration({
          isAuthenticated: auth.isAuthenticated,
          anonymousStructure,
          authorizedStructure,
          unAuthorizedStructure,
          fallbackComponent: <PageNotFound />
        })}
      </Switch>
    </ConnectedRouter>
  );
}

const mapStateToProps = store => ({
  auth: store.auth
});

export default connect(mapStateToProps)(AppNavigation);
```

# Explanation
The important thing is **RoutesConfiguration** function which accepts an object that has **5** props
1. isAuthenticated ----> Boolean
2. anonymousStructure ----> Object
3. authorizedStructure ----> Object
4. unAuthorizedStructure ----> Object
5. fallbackComponent ----> JSX Element

### **isAuthenticated**
it's **[ very important ]** because it's used to differentiate LoggedIn/out users to give back the wanted routes.

prop            | Type  | isRequired
----------------|-------|-----------
isAuthenticated | bool  | true

### **anonymousStructure**
it's an object that **[ ONLY ]** has **1** prop which is routes array [ each item is a **route Model** ], these routes are allowed for all personas **regardless he/she authenticated or not**.

prop               | sibling                   | Type    | isRequired
-------------------|---------------------------|---------|------------
anonymousStructure |  **routes**               | object  | false
routes             |  **array of Route Model** | array   | true

### **authorizedStructure**
it's an object that **[ ONLY ]** has **2** props which is routes array [ each item is a **route Model** ], these routes are **allowed for [ LoggedIn ] users** and the **second option is fallbackPath**: which is used to redirect to predefined url [ if a user didn't make a login then he tried to access a page from authorized routes ].
prop                | sibling                    | Type    | isRequired
--------------------|----------------------------|---------|----------------------------------------
authorizedStructure |  **routes, fallbackPath**  | object  | false
routes              |  **array of Route Model**  | array   | true
fallbackPath        | none                       | string  | true [ in case of routes is provided ]


### **unAuthorizedStructure**
it's an object that **[ ONLY ]** has **2** props which is routes array [ each item is a **route Model** ], these routes are **allowed for [ LoggedOut ] users** and the **second option is fallbackPath**: which is used to redirect to predefined url **[ if a loggedIn user didn't make a logout then he tried to access a page from authorized routes ]**.

prop                  | sibling                    | Type    | isRequired
----------------------|----------------------------|---------|----------------------------------------
unAuthorizedStructure |  **routes, fallbackPath**  | object  | false
routes                |  **array of Route Model**  | array   | true
fallbackPath          | none                       | string  | true [ in case of routes is provided ]

### **fallbackComponent**
it's a jsx component that is used as a fallback for the whole router Like **('404', NotFound)**

prop              | Type        | isRequired
------------------|-------------|-----------
fallbackComponent | JSX Element | false

### **route Model**
prop         | Type            | Usage                                                                    | isRequired
-------------|-----------------|--------------------------------------------------------------------------|------------
path         | string          |  To specify the route path                                               | true
component    | React.Component |  Rendered route component                                                | true
routeProps   | object          |  To override route props                                                 | false
redirectPath | string          |  To redirect to specific location **[ instead of parent fallbackPath ]** | false
showRouteIf  | boolean         |  To decide when to show/hide the route                                   | false

```javascript
  const unAuthorizedStructure = {
    fallbackPath: '/home',
    routes: [
      {/*  Route Model */
        /**
         * path: string
         * component: React.Component
         * routeProps: Object -----> To override route props
         * redirectPath: String ----> To redirect to specific location [ instead of fallbackPath ]
         * showRouteIf: Boolean ----> To decide when to show/hide the route
         */
      }
    ]
  }

```
