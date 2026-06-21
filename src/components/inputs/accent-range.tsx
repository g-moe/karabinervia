import React, { useState, useEffect } from "react";
import styled from "styled-components";

const Container = styled.span`
  display: inline-flex;
  align-items: center;
  line-height: initial;
  gap: 8px;
  width: 200px;
`;

const SliderInput = styled.input.attrs({ type: "range" })`
  accent-color: var(--color_control-border);
  width: 100%;
  flex: none;
`;

export const AccentRange: React.FC<
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "type"> & {
    onChange: (x: number) => void;
  }
> = (props) => {
  const { defaultValue, value, onChange, ...inputProps } = props;
  const [currentValue, setCurrentValue] = useState<number>(
    Number(defaultValue || value || props.min || 0),
  );

  useEffect(() => {
    const newValue = Number(defaultValue || value || props.min || 0);
    setCurrentValue(newValue);
  }, [defaultValue, value, props.min]);

  const handleChange = (newValue: number) => {
    setCurrentValue(newValue);
    onChange(newValue);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = +e.target.value;
    handleChange(newValue);
  };

  return (
    <Container>
      <SliderInput {...inputProps} value={currentValue} onChange={handleSliderChange} />
    </Container>
  );
};
