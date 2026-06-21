import styled from "styled-components";
import { buttonSurface } from "./control-styles";

export const Button = styled.div`
  ${buttonSurface}
  display: flex;
  width: 45px;
  height: 45px;
  padding: 2px;
  margin: 2px;
  text-overflow: ellipsis;
  overflow: hidden;
  font-size: 12px;
  text-align: center;
  border-radius: var(--radius_button);
  justify-content: center;
  align-items: center;
  white-space: pre-wrap;

  &:hover {
    transform: translate3d(0, -2px, 0);
  }
`;

export default Button;
