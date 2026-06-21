import {FC, useMemo, useState} from 'react';
import {faLanguage} from '@fortawesome/free-solid-svg-icons';
import {CategoryIconContainer} from '../panes/grid';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import styled from 'styled-components';
import {useTranslation} from 'react-i18next';
import {
  dropdownMenuVisibility,
  menuItemSurface,
  menuListSurface,
  scrimSurface,
} from '../inputs/control-styles';

const Container = styled.div`
  position: relative;
  font-size: 18px;
`;

const LanguageList = styled.ul<{$show: boolean}>`
  ${menuListSurface}
  ${dropdownMenuVisibility}
  top: 30px;
  right: 0px;
`;

const LanugaeButton = styled.button<{$selected?: boolean}>`
  ${menuItemSurface}
`;

const ClickCover = styled.div`
  ${scrimSurface}
`;

const LanguageSelectors: React.FC<{
  show: boolean;
  onClickOut: () => void;
}> = (props) => {
  const langs = [
    {code: 'en', lang: 'English'},
    {code: 'zh', lang: '中文'},
    {code: 'ko', lang: '한국어'},
    {code: 'ja', lang: '日本語'},
    {code: 'es', lang: 'Español'},
    {code: 'de', lang: 'Deutsch'},
  ];
  const {i18n} = useTranslation();
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    props.onClickOut();
  };

  const selectLang = useMemo(() => {
    return i18n.resolvedLanguage
      ? i18n.resolvedLanguage
      : i18n.languages[i18n.languages.length - 1];
  }, [i18n.resolvedLanguage, i18n.languages]);

  return (
    <>
      {props.show && <ClickCover onClick={props.onClickOut} />}
      <LanguageList $show={props.show}>
        {langs.map(({lang, code}) => {
          return (
            <LanugaeButton
              $selected={code === selectLang}
              key={code}
              onClick={() => changeLanguage(code)}
            >
              {lang}
            </LanugaeButton>
          );
        })}
      </LanguageList>
    </>
  );
};

export const LanguageSelect: FC = () => {
  const [showList, setShowList] = useState(false);
  return (
    <Container>
      <CategoryIconContainer>
        <FontAwesomeIcon
          size={'xl'}
          icon={faLanguage}
          onClick={() => setShowList(true)}
        />
      </CategoryIconContainer>
      <LanguageSelectors
        show={showList}
        onClickOut={() => setShowList(false)}
      />
    </Container>
  );
};
