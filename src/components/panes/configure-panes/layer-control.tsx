import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "src/store/hooks";
import { getNumberOfLayers, getSelectedLayerIndex, setLayer } from "src/store/keymapSlice";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { pillButtonSurface } from "src/components/inputs/control-styles";

const Container = styled.div`
  position: absolute;
  left: 15px;
  font-weight: 400;
  top: 10px;
`;
const Label = styled.label`
  font-size: 20px;
  text-transform: uppercase;
  color: var(--color_text-primary);
  margin-right: 6px;
`;
const LayerButton = styled.button<{ $selected?: boolean }>`
  ${pillButtonSurface}
  font-variant-numeric: tabular-nums;
  font-size: 20px;
  font-weight: 400;
  padding: 0 5px;
`;

export const LayerControl = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const numberOfLayers = useAppSelector(getNumberOfLayers);
  const selectedLayerIndex = useAppSelector(getSelectedLayerIndex);

  const Layers = useMemo(
    () =>
      Array.from({ length: numberOfLayers }, (_, layerLabel) => (
        <LayerButton
          key={layerLabel}
          aria-label={`Layer ${layerLabel}`}
          $selected={layerLabel === selectedLayerIndex}
          onClick={() => dispatch(setLayer(layerLabel))}
        >
          {layerLabel}
        </LayerButton>
      )),
    [numberOfLayers, selectedLayerIndex],
  );

  return (
    <Container>
      <Label>{t("Layer")}</Label>
      {Layers}
    </Container>
  );
};
