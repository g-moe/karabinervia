import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faCancel, faComputer, faDownload, faWarning } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PropsWithChildren, useState } from "react";
import { useDispatch } from "react-redux";
import { AppError, clearAppErrors, getAppErrors } from "../../store/errorsSlice";
import { useAppSelector } from "../../store/hooks";
import { DeviceInfo } from "../../types/types";
import { formatNumberAsHex } from "../../utils/format";
import styled from "styled-components";
import { Link, useLocation } from "wouter";
import { IconButtonContainer } from "../inputs/icon-button";
import { iconButtonGroupSurface } from "../inputs/control-styles";
import { CategoryMenuTooltip, IconButtonTooltip } from "../inputs/tooltip";
import { CategoryIconContainer } from "./grid";
import {
  BottomSection,
  BottomSectionContent,
  BottomSectionNav,
  BottomSectionNavItem,
  BottomSectionTopBar,
} from "./bottom-section";
import { Pane } from "./pane";
import { useTranslation } from "react-i18next";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  user-select: text;
  border-top: 1px solid var(--color_accent);
  &:last-of-type {
    border-bottom: 1px solid var(--color_accent);
  }
`;

const printId = (id: number) => formatNumberAsHex(id, 4);

const ErrorListContainer: React.FC<
  PropsWithChildren<{
    clear: () => void;
    save: () => void;
    hasErrors: boolean;
  }>
> = (props) => {
  const { t } = useTranslation();
  const { clear, save, hasErrors } = props;
  return (
    <>
      <ErrorToolbar>
        <IconButtonContainer onClick={clear} disabled={!hasErrors}>
          <FontAwesomeIcon size={"sm"} color="var(--color_text-secondary)" icon={faCancel} />
          <IconButtonTooltip>{t("Clear")}</IconButtonTooltip>
        </IconButtonContainer>
        <IconButtonContainer onClick={save} disabled={!hasErrors}>
          <FontAwesomeIcon size={"sm"} color="var(--color_text-secondary)" icon={faDownload} />
          <IconButtonTooltip>{t("Download")}</IconButtonTooltip>
        </IconButtonContainer>
      </ErrorToolbar>
      {props.children}
    </>
  );
};

const AppErrors: React.FC = () => {
  const errors = useAppSelector(getAppErrors);
  const dispatch = useDispatch();
  return (
    <ErrorListContainer
      clear={() => dispatch(clearAppErrors())}
      save={() => saveAppErrors(errors)}
      hasErrors={!!errors.length}
    >
      {errors.map(
        ({ timestamp, deviceInfo: { productId, productName, vendorId }, message: error }) => (
          <Container key={timestamp}>
            {timestamp}
            <ul>
              {error?.split("\n").map((line) => (
                <li>{line}</li>
              ))}
            </ul>
            <ul>
              <li>Device: {productName}</li>
              <li>Vid: {printId(vendorId)}</li>
              <li>Pid: {printId(productId)}</li>
            </ul>
          </Container>
        ),
      )}
    </ErrorListContainer>
  );
};

async function saveErrors<T>(
  errors: T[],
  headers: Array<keyof (T & DeviceInfo)>,
  fileName: string,
  printRow: (error: T) => string,
) {
  try {
    const handle = await window.showSaveFilePicker({
      suggestedName: `${fileName}.csv`,
    });
    const csvHeaders = [headers.join(", ")];
    const data = errors.map(printRow);
    const csv = csvHeaders.concat(...data).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const writeable = await handle.createWritable();
    await writeable.write(blob);
    await writeable.close();
  } catch {
    console.log("User cancelled save errors request");
  }
}

const saveAppErrors = async (errors: AppError[]) =>
  saveErrors(
    errors,
    ["timestamp", "productName", "vendorId", "productId", "message"],
    "VIA-app-errors",
    ({ timestamp, deviceInfo: { productName, vendorId, productId }, message }) =>
      `${timestamp}, ${productName}, ${printId(vendorId)}, ${printId(productId)}, "${message}"`,
  );

const IconButtonGroupContainer = styled.div`
  ${iconButtonGroupSurface}
`;

const ErrorToolbar = styled(IconButtonGroupContainer)`
  margin: 10px 15px;
`;

enum ErrorPaneMenu {
  App,
}

const ErrorPanes: [ErrorPaneMenu, React.FC, IconProp, string][] = [
  [ErrorPaneMenu.App, AppErrors, faComputer, "App"],
];

export const Errors = () => {
  const [selectedPane, setSelectedPane] = useState(ErrorPaneMenu.App);
  const PaneComponent = (ErrorPanes.find(([id]) => selectedPane === id) || ErrorPanes[0])[1];
  return (
    <Pane>
      <BottomSection>
        <BottomSectionTopBar>
          <BottomSectionNav>
            {ErrorPanes.map(([id, _, Icon, menuName]) => (
              <BottomSectionNavItem
                selected={selectedPane === id}
                onClick={() => {
                  setSelectedPane(id);
                }}
                tooltip={menuName}
                key={id}
              >
                <FontAwesomeIcon icon={Icon} />
              </BottomSectionNavItem>
            ))}
          </BottomSectionNav>
        </BottomSectionTopBar>
        <BottomSectionContent>
          <PaneComponent />
        </BottomSectionContent>
      </BottomSection>
    </Pane>
  );
};

export const ErrorLink = () => {
  const appErrors = useAppSelector(getAppErrors);
  const [location] = useLocation();
  const isSelectedRoute = location === "/errors";
  if (appErrors.length) {
    return (
      <Link to="/errors">
        <CategoryIconContainer $selected={isSelectedRoute}>
          <FontAwesomeIcon
            size={"xl"}
            icon={ErrorsPaneConfig.icon}
            color={isSelectedRoute ? "inherit" : "var(--color_warning)"}
          />
          <CategoryMenuTooltip>
            {appErrors.length} error
            {appErrors.length > 1 ? "s" : ""}
          </CategoryMenuTooltip>
        </CategoryIconContainer>
      </Link>
    );
  }

  return null;
};

export const ErrorsPaneConfig = {
  component: Errors,
  path: "/errors",
  icon: faWarning,
  key: "errors",
  title: "Errors",
};
