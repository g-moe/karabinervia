import { faKeyboard, faStethoscope } from "@fortawesome/free-solid-svg-icons";
import { ConfigurePane } from "../components/panes/configure";
import { Test } from "../components/panes/test";
import { ErrorsPaneConfig } from "../components/panes/errors";

export default [
  {
    key: "default",
    component: ConfigurePane,
    icon: faKeyboard,
    title: "Configure",
    path: "/",
  },
  {
    key: "test",
    component: Test,
    icon: faStethoscope,
    path: "/test",
    title: "Key Tester",
  },
  ErrorsPaneConfig,
];
