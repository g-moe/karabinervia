import React from 'react';
import Select, {Props} from 'react-select';

const readableTextColor = 'var(--color_control-text)';
const mutedTextColor = 'var(--color_control-text-muted)';
const disabledTextColor = 'var(--color_control-text-disabled)';
const controlBorderColor = 'var(--color_control-border)';
const disabledBorderColor = 'var(--color_control-border-disabled)';
const selectedBackgroundColor = 'var(--color_control-selected-bg)';
const selectedTextColor = 'var(--color_control-selected-text)';

const customStyles = {
  option: (provided: any, state: any) => {
    return {
      ...provided,
      '&:hover': {
        backgroundColor: state.isSelected
          ? selectedBackgroundColor
          : 'var(--bg_control)',
      },
      ':active': {
        backgroundColor: 'var(--bg_control)',
      },
      background: state.isSelected
        ? selectedBackgroundColor
        : state.isFocused
        ? 'var(--bg_control)'
        : 'var(--bg_menu)',
      color: state.isSelected
        ? selectedTextColor
        : state.isFocused
        ? readableTextColor
        : readableTextColor,
    };
  },
  container: (provided: any) => ({
    ...provided,
    lineHeight: 'initial',
    flex: 1,
  }),
  input: (provided: any) => ({
    ...provided,
    color: readableTextColor,
    opacity: 1,
  }),
  singleValue: (provided: any, state: any) => ({
    ...provided,
    color: state.isDisabled ? disabledTextColor : readableTextColor,
    opacity: 1,
  }),
  dropdownIndicator: (provided: any, state: any) => ({
    ...provided,
    color: state.isDisabled ? disabledTextColor : controlBorderColor,
    opacity: state.isDisabled ? 0.75 : 1,
  }),
  indicatorSeparator: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isDisabled ? disabledBorderColor : controlBorderColor,
  }),
  menuList: (provided: any) => ({
    ...provided,
    borderColor: controlBorderColor,
    backgroundColor: 'var(--bg_menu)',
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: mutedTextColor,
  }),
  valueContainer: (provided: any, state: any) => ({
    ...provided,
    ':active': {
      backgroundColor: 'var(--bg_control)',
      borderColor: controlBorderColor,
    },
    '&:hover': {
      borderColor: controlBorderColor,
    },
    color: state.isDisabled ? disabledTextColor : readableTextColor,
    background: 'var(--bg_menu)',
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
      background: 'var(--bg_menu)',
      overflow: 'hidden',
      opacity: 1,
      width: state.selectProps.width || 250,
    };
    return res;
  },
};

export const AccentSelect: React.FC<Props> = (props) => (
  <Select {...props} styles={customStyles} />
);
