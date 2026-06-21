import {Color} from '@the-via/reader';
import {useMemo, useState} from 'react';
import {getRGB} from 'src/utils/color-math';
import styled from 'styled-components';
import {roundSwatchSurface} from './control-styles';
import {ColorPicker} from './color-picker';

type Props = {
  color: Color;
  setColor: (hue: number, sat: number) => void;
};

const ColorPalettePickerContainer = styled.div`
  display: flex;
  align-items: center;
  column-gap: 10px;
`;

const PreviousColorContainer = styled.div`
  display: flex;
  background: var(--color_control-background);
  border-radius: var(--radius_menu);
  padding: 2px;
`;

const PreviousColorOption = styled.div<{$selected: boolean; $color: string}>`
  ${roundSwatchSurface}
  background: ${(props) => props.$color};
  transform: ${(props) => (props.$selected ? 'scale(0.8)' : 'scale(0.6)')};
`;

export const ColorPalettePicker: React.FC<{
  color: [number, number];
  setColor: Props['setColor'];
}> = (props) => {
  const {color, setColor} = props;
  const [selectedColor, setSelectedColor] = useState(color);
  const [colorPickerColor, setPickerColor] = useState(color);
  const initialColors = useMemo(() => {
    return Array(9)
      .fill(0)
      .map((_, i) => {
        return [Math.round((i * 255) / 10), 255, 255];
      });
  }, []);
  return (
    <ColorPalettePickerContainer>
      <PreviousColorContainer>
        {initialColors.map((savedColor, idx) => {
          const isSelected =
            selectedColor[0] === savedColor[0] &&
            selectedColor[1] === savedColor[1];
          return (
            <PreviousColorOption
              key={idx}
              $selected={isSelected}
              $color={getRGB({
                hue: savedColor[0] ?? 0,
                sat: savedColor[1] ?? 0,
              })}
              onClick={() => {
                setSelectedColor(savedColor as [number, number]);
                setColor(savedColor[0], savedColor[1]);
              }}
            />
          );
        })}
      </PreviousColorContainer>
      <ColorPicker
        isSelected={
          colorPickerColor[0] === selectedColor[0] &&
          colorPickerColor[1] === selectedColor[1]
        }
        color={{hue: colorPickerColor[0], sat: colorPickerColor[1]}}
        setColor={(h, s) => {
          setSelectedColor([h, s]);
          setPickerColor([h, s]);
        }}
        onOpen={() => {
          setSelectedColor([colorPickerColor[0], colorPickerColor[1]]);
          setColor(colorPickerColor[0], colorPickerColor[1]);
        }}
        onMouseUp={() => {
          setSelectedColor([colorPickerColor[0], colorPickerColor[1]]);
          setColor(colorPickerColor[0], colorPickerColor[1]);
        }}
      />
    </ColorPalettePickerContainer>
  );
};
