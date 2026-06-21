import {FC, useState} from 'react';
import {faBars} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import styled from 'styled-components';
import {useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {AccentSlider} from '../inputs/accent-slider';
import {
  dropdownMenuVisibility,
  menuListSurface,
  scrimSurface,
} from '../inputs/control-styles';
import {CategoryIconContainer} from '../panes/grid';
import {Detail, Label} from '../panes/grid';
import {useAppSelector} from 'src/store/hooks';
import {
  getDisableFastRemap,
  getThemeMode,
  toggleFastRemap,
  toggleThemeMode,
} from 'src/store/settingsSlice';

const Container = styled.div`
  position: relative;
  font-size: 18px;
`;

const MenuPanel = styled.div<{$show: boolean}>`
  ${menuListSurface}
  ${dropdownMenuVisibility}
  width: 360px;
  top: 30px;
  right: 0;
`;

const MenuRow = styled.div`
  min-height: 50px;
  border-bottom: 1px solid var(--color_separator);
  display: flex;
  align-items: center;
  justify-content: space-between;
  column-gap: 20px;
  padding: 0 12px;
`;

const ClickCover = styled.div`
  ${scrimSurface}
`;

export const SettingsMenu: FC = () => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const disableFastRemap = useAppSelector(getDisableFastRemap);
  const themeMode = useAppSelector(getThemeMode);

  return (
    <Container>
      <CategoryIconContainer onClick={() => setShowMenu(true)}>
        <FontAwesomeIcon size="xl" icon={faBars} />
      </CategoryIconContainer>
      {showMenu && <ClickCover onClick={() => setShowMenu(false)} />}
      <MenuPanel $show={showMenu}>
        <MenuRow>
          <Label>{t('Fast Key Mapping')}</Label>
          <Detail>
            <AccentSlider
              onChange={() => dispatch(toggleFastRemap())}
              isChecked={!disableFastRemap}
            />
          </Detail>
        </MenuRow>
        <MenuRow>
          <Label>{t('Light Mode')}</Label>
          <Detail>
            <AccentSlider
              onChange={() => dispatch(toggleThemeMode())}
              isChecked={themeMode === 'light'}
            />
          </Detail>
        </MenuRow>
      </MenuPanel>
    </Container>
  );
};
