import React from "react";
import { Route, Switch } from "react-router-dom";

import Home from "./containers/home";
import About from "./containers/about";
import SignUp from "./containers/signup";
import Tasks from "./containers/tasks";
import NotFound from "./containers/notfound";

import AppliedRoute from "./components/AppliedRoute";


export default ({ childProps }) =>
  <Switch>
    <AppliedRoute path="/" exact component={Home} props={childProps} />
    <AppliedRoute path="/tasks" exact component={Tasks} props={childProps} />
    <AppliedRoute path="/about" exact component={About} props={childProps} />
    <AppliedRoute path="/signup" exact component={SignUp} props={childProps} />

    { /* Finally, catch all unmatched routes */ }
    <Route component={NotFound} />
  </Switch>;
