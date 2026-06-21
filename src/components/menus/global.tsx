import React, {useMemo} from 'react';
import styled from 'styled-components';
import {Link, useLocation} from 'wouter';
import PANES from '../../utils/pane-config';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {CategoryMenuTooltip} from '../inputs/tooltip';
import {CategoryIconContainer} from '../panes/grid';
import {ErrorLink, ErrorsPaneConfig} from '../panes/errors';
import {useTranslation} from 'react-i18next';
import {LanguageSelect} from './language-select';
import {SettingsMenu} from './settings-menu';

const Container = styled.div`
  width: 100vw;
  height: 25px;
  padding: 12px 0;
  border-bottom: 1px solid var(--color_separator);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const GlobalContainer = styled(Container)`
  background: var(--color_panel-background);
`;

const CenterNav = styled.nav`
  display: flex;
  align-items: center;
  column-gap: 20px;
`;

const HeaderActions = styled.div`
  position: absolute;
  right: 20px;
  display: flex;
  align-items: center;
  column-gap: 12px;
`;

export const UnconnectedGlobalMenu = () => {
  const {t} = useTranslation();

  const [location] = useLocation();

  const Panes = useMemo(() => {
    return PANES.filter((pane) => pane.key !== ErrorsPaneConfig.key).map(
      (pane) => {
        return (
          <Link key={pane.key} to={pane.path}>
            <CategoryIconContainer $selected={pane.path === location}>
              <FontAwesomeIcon size={'xl'} icon={pane.icon} />
              <CategoryMenuTooltip>{t(pane.title)}</CategoryMenuTooltip>
            </CategoryIconContainer>
          </Link>
        );
      },
    );
  }, [location]);

  return (
    <React.Fragment>
      <GlobalContainer>
        <CenterNav>
          <ErrorLink />
          {Panes}
        </CenterNav>
        <HeaderActions>
          <LanguageSelect />
          <SettingsMenu />
        </HeaderActions>
      </GlobalContainer>
    </React.Fragment>
  );
};
