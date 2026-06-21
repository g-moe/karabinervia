import React from 'react';
import styled from 'styled-components';
import {AccentButton} from './accent-button';
type Props = {
  onLoad: (files: File[]) => void;
  multiple?: boolean;
  inputRef?: React.MutableRefObject<HTMLInputElement | undefined>;
  children: string;
};

export function AccentUploadButton(props: Props) {
  const input = props.inputRef || React.useRef<HTMLInputElement>();
  function onChange(e: any) {
    props.onLoad(e.target.files as File[]);
    (input.current as any).value = null;
  }
  return (
    <AccentButton onClick={() => input.current && input.current.click()}>
      {props.children}
      <HiddenFileInput
        ref={input as any}
        type="file"
        multiple={props.multiple}
        accept="application/json"
        onChange={onChange}
      />
    </AccentButton>
  );
}

const HiddenFileInput = styled.input`
  display: none;
`;
