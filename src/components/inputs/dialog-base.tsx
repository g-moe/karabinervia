import styled from "styled-components";
import { modalSurface } from "./control-styles";

export const ModalBackground = styled.div`
  position: fixed;
  inset: 0;
  background: var(--color_scrim);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
`;

export const ModalContainer = styled.div`
  ${modalSurface}
`;

export const PromptText = styled.div`
  font-weight: 500;
  user-select: none;
  color: var(--color_text-secondary);
  font-size: 20px;
  text-align: center;
`;

export const RowDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 220px;
  gap: 20px;
`;
