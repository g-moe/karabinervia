import { UnconnectedGlobalMenu } from "./components/menus/global";
import { Route, Switch } from "wouter";
import PANES from "./utils/pane-config";
import { createGlobalStyle } from "styled-components";
import { CanvasRouter as CanvasRouter2D } from "./components/two-string/canvas-router";
import { TestContext } from "./components/panes/test";
import { useMemo, useState } from "react";
import { VirtualDeviceBootstrap } from "./karabiner/VirtualDeviceBootstrap";
import { NotFound } from "./components/panes/not-found";

const GlobalStyle = createGlobalStyle`
  *:focus {
    outline: none;
  }
`;

export default () => {
  const RouteComponents = useMemo(
    () =>
      PANES.map((pane) => {
        return <Route component={pane.component} key={pane.key} path={pane.path} />;
      }),
    [],
  );

  const testContextState = useState({ clearTestKeys: () => {} });
  return (
    <>
      <TestContext.Provider value={testContextState}>
        <VirtualDeviceBootstrap />
        <GlobalStyle />
        <UnconnectedGlobalMenu />
        <CanvasRouter2D />
        <Switch>
          {RouteComponents}
          <Route>
            <NotFound />
          </Route>
        </Switch>
      </TestContext.Provider>
    </>
  );
};
