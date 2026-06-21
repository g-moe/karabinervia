import styled from 'styled-components';

const TextInput = styled.input`
  background: none;
  border: none;
  border-bottom: 1px solid var(--color_control-border);
  color: var(--color_control-text);
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  padding: 0.5rem;
  transition: all 0.2s ease-out;

  &:focus {
    color: var(--color_control-text);
    outline: none;
  }

  &::placeholder {
    color: var(--color_control-text-muted);
  }
`;

export default TextInput;
