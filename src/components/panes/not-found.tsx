import { faArrowLeft, faKeyboard } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import { Link } from "wouter";
import { PanelPane } from "./pane";

const NotFoundPane = styled(PanelPane)`
  align-items: center;
  background: var(--background_app);
  display: flex;
  justify-content: center;
  padding: 48px;
`;

const Content = styled.main`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 22px;
  max-width: 520px;
  text-align: center;
`;

const IconShell = styled.div`
  align-items: center;
  background: var(--color_control-background);
  border: 1px solid var(--color_separator);
  border-radius: 18px;
  box-shadow: var(--box-shadow-control-raised);
  color: var(--color_text-secondary);
  display: flex;
  height: 76px;
  justify-content: center;
  width: 76px;
`;

const Eyebrow = styled.div`
  color: var(--color_text-tertiary);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const Title = styled.h1`
  color: var(--color_text-primary);
  font-size: 42px;
  font-weight: 600;
  letter-spacing: 0;
  line-height: 1.08;
  margin: 0;
`;

const Message = styled.p`
  color: var(--color_text-secondary);
  font-size: 17px;
  line-height: 1.45;
  margin: 0;
`;

const HomeLink = styled(Link)`
  align-items: center;
  background: var(--color_control-selected-bg);
  border-radius: var(--radius_control);
  box-shadow: var(--box-shadow-control-raised);
  color: var(--color_control-selected-text);
  column-gap: 9px;
  display: inline-flex;
  font-size: 15px;
  font-weight: 600;
  opacity: 1;
  padding: 11px 16px;
  transition:
    background-color var(--duration_control) var(--ease_control),
    filter var(--duration_control) var(--ease_control),
    transform var(--duration_control) var(--ease_control);

  &:hover {
    filter: var(--filter_control-hover);
    transform: translateY(-1px);
  }
`;

export const NotFound = () => (
  <NotFoundPane>
    <Content>
      <IconShell>
        <FontAwesomeIcon icon={faKeyboard} size="2x" />
      </IconShell>
      <Eyebrow>404</Eyebrow>
      <Title>Page not found</Title>
      <Message>This route is not part of the KarabinerVIA workspace.</Message>
      <HomeLink to="/">
        <FontAwesomeIcon icon={faArrowLeft} />
        Back to keyboard
      </HomeLink>
    </Content>
  </NotFoundPane>
);
