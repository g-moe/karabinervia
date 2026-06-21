import styled from 'styled-components';

export const Message = styled.span`
  font-size: 18px;
  margin: 8px;
  text-align: center;
`;

export const ErrorMessage = styled(Message)`
  color: var(--color_error);
`;

export const SuccessMessage = styled(Message)`
  color: var(--color_success);
`;
