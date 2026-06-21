import React from "react";
import styled from "styled-components";
import { AccentButton } from "./accent-button";
type Props = {
  onLoad: (files: File[]) => void;
  multiple?: boolean;
  inputRef?: React.MutableRefObject<HTMLInputElement | undefined>;
  children: string;
  buttonTestId?: string;
  inputTestId?: string;
};

export function AccentUploadButton(props: Props) {
  const input = props.inputRef || React.useRef<HTMLInputElement>(undefined);
  function onChange(e: any) {
    props.onLoad(e.target.files as File[]);
    (input.current as any).value = null;
  }
  return (
    <AccentButton
      data-testid={props.buttonTestId}
      onClick={() => input.current && input.current.click()}
    >
      {props.children}
      <HiddenFileInput
        data-testid={props.inputTestId}
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
