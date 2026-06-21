import React from 'react';
import Select, {Props} from 'react-select';

const readableTextColor = 'var(--color_control-text)';
const mutedTextColor = 'var(--color_control-text-muted)';
const disabledTextColor = 'var(--color_control-text-disabled)';
const controlBorderColor = 'var(--color_control-border)';
const disabledBorderColor = 'var(--color_control-border-disabled)';
const selectedBackgroundColor = 'var(--color_control-selected-subtle-bg)';
const selectedTextColor = 'var(--color_control-selected-subtle-text)';
const controlHeight = 38;
const controlRadius = 'var(--radius_control)';

const customStyles = {
  option: (provided: any, state: any) => {
    return {
      ...provided,
      '&:hover': {
        backgroundColor: state.isSelected
          ? selectedBackgroundColor
          : 'var(--color_control-background-hover)',
      },
      ':active': {
        backgroundColor: 'var(--color_control-background-active)',
      },
      background: state.isSelected
        ? selectedBackgroundColor
        : state.isFocused
        ? 'var(--color_control-background-hover)'
        : 'var(--color_surface-menu)',
      color: state.isSelected
        ? selectedTextColor
        : state.isFocused
        ? readableTextColor
        : readableTextColor,
    };
  },
  container: (provided: any) => ({
    ...provided,
    lineHeight: 'normal',
    flex: 1,
  }),
  input: (provided: any) => ({
    ...provided,
    color: readableTextColor,
    opacity: 1,
    margin: 0,
    padding: 0,
  }),
  singleValue: (provided: any, state: any) => ({
    ...provided,
    color: state.isDisabled ? disabledTextColor : readableTextColor,
    opacity: 1,
    margin: 0,
    position: 'static',
    transform: 'none',
    lineHeight: `${controlHeight}px`,
  }),
  dropdownIndicator: (provided: any, state: any) => ({
    ...provided,
    color: state.isDisabled ? disabledTextColor : controlBorderColor,
    opacity: state.isDisabled ? 0.75 : 1,
    padding: '0 10px',
  }),
  indicatorSeparator: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isDisabled ? disabledBorderColor : controlBorderColor,
  }),
  menuList: (provided: any) => ({
    ...provided,
    borderColor: controlBorderColor,
    backgroundColor: 'var(--color_surface-menu)',
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: mutedTextColor,
  }),
  valueContainer: (provided: any, state: any) => ({
    ...provided,
    ':active': {
      backgroundColor: 'var(--color_control-background-active)',
      borderColor: controlBorderColor,
    },
    '&:hover': {
      borderColor: controlBorderColor,
    },
    color: state.isDisabled ? disabledTextColor : readableTextColor,
    background: 'var(--color_surface-menu)',
    alignItems: 'center',
    display: 'flex',
    height: controlHeight,
    minHeight: controlHeight,
    padding: '0 12px',
  }),
  control: (provided: any, state: any) => {
    const res = {
      ...provided,
      boxShadow: 'none',
      ':active': {
        backgroundColor: 'transparent',
        borderColor: controlBorderColor,
      },
      '&:hover': {
        borderColor: controlBorderColor,
      },
      color: state.isDisabled ? disabledTextColor : readableTextColor,
      borderColor: state.isDisabled ? disabledBorderColor : controlBorderColor,
      background: 'var(--color_surface-menu)',
      overflow: 'hidden',
      opacity: 1,
      width: state.selectProps.width || 250,
      minHeight: controlHeight,
      height: controlHeight,
      borderRadius: controlRadius,
    };
    return res;
  },
};

export const AccentSelect: React.FC<Props> = (props) => (
  <Select {...props} styles={customStyles} />
);
