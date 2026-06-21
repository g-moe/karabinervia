import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ChippyLoader from "../chippy-loader";
import LoadingText from "../loading-text";
import { CenterPane, ConfigureBasePane } from "./pane";
import type { VIADefinitionV2, VIADefinitionV3 } from "@the-via/reader";
import { ConfigureFlexCell } from "./grid";
import {
  BottomSection,
  BottomSectionContent,
  BottomSectionNav,
  BottomSectionNavItem,
  BottomSectionTopBar,
} from "./bottom-section";
import * as Keycode from "./configure-panes/keycode";
import * as SaveLoad from "./configure-panes/save-load";
import { LayerControl } from "./configure-panes/layer-control";
import { Badge } from "./configure-panes/badge";
import { useAppSelector } from "../../store/hooks";
import { getSelectedDefinition } from "../../store/definitionsSlice";
import {
  clearSelectedKey,
  getLoadProgress,
  setConfigureKeyboardIsSelectable,
} from "../../store/keymapSlice";
import { useDispatch } from "react-redux";
import { getSelectedTheme } from "../../store/settingsSlice";
import { useTranslation } from "react-i18next";

const Rows = [Keycode, SaveLoad];

const getRowsForKeyboard = (): typeof Rows => {
  const selectedDefinition = useAppSelector(getSelectedDefinition);

  if (!selectedDefinition) {
    return [];
  }
  return Rows;
};

const Loader: React.FC<{
  loadProgress: number;
  selectedDefinition: VIADefinitionV2 | VIADefinitionV3 | null;
}> = (props) => {
  const { loadProgress, selectedDefinition } = props;
  const theme = useAppSelector(getSelectedTheme);
  return (
    <LoaderPane>
      {<ChippyLoader theme={theme} progress={loadProgress || null} />}
      <LoadingText isSearching={!selectedDefinition} />
    </LoaderPane>
  );
};

const LoaderPane = styled(CenterPane)`
  display: flex;
  align-items: center;
  justify-content: center;
  row-gap: 50px;
  position: absolute;
  bottom: 50px;
  top: 50px;
  left: 0;
  right: 0;
  z-index: 4;
`;

const ConfigureOverlay = styled(ConfigureFlexCell)`
  pointer-events: none;
  position: absolute;
  top: 50px;
  left: 0;
  right: 0;
`;

const ConfigureControls = styled.div`
  pointer-events: all;
`;

export const ConfigurePane = () => {
  const selectedDefinition = useAppSelector(getSelectedDefinition);
  const loadProgress = useAppSelector(getLoadProgress);

  const showLoader = !selectedDefinition || loadProgress !== 1;
  return showLoader ? (
    <Loader selectedDefinition={selectedDefinition || null} loadProgress={loadProgress} />
  ) : (
    <ConfigureBasePane>
      <ConfigureGrid />
    </ConfigureBasePane>
  );
};

const ConfigureGrid = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [selectedRow, setRow] = useState(0);
  const KeyboardRows = getRowsForKeyboard();
  const SelectedPane = KeyboardRows[selectedRow]?.Pane;
  const selectedTitle = KeyboardRows[selectedRow]?.Title;

  useEffect(() => {
    if (selectedTitle !== "Keymap") {
      dispatch(setConfigureKeyboardIsSelectable(false));
    } else {
      dispatch(setConfigureKeyboardIsSelectable(true));
    }
  }, [selectedTitle]);

  return (
    <>
      <ConfigureOverlay
        onClick={(evt) => {
          if ((evt.target as any).nodeName !== "CANVAS") dispatch(clearSelectedKey());
        }}
      >
        <ConfigureControls>
          <LayerControl />
          <Badge />
        </ConfigureControls>
      </ConfigureOverlay>
      <BottomSection>
        <BottomSectionTopBar>
          <BottomSectionNav>
            {(KeyboardRows || []).map(
              ({ Icon, Title }: { Icon: any; Title: string }, idx: number) => (
                <BottomSectionNavItem
                  key={idx}
                  onClick={() => setRow(idx)}
                  selected={selectedRow === idx}
                  tooltip={t(Title)}
                >
                  <Icon />
                </BottomSectionNavItem>
              ),
            )}
          </BottomSectionNav>
        </BottomSectionTopBar>

        <BottomSectionContent>{SelectedPane && <SelectedPane />}</BottomSectionContent>
      </BottomSection>
    </>
  );
};
