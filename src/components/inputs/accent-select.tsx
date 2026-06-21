import React from 'react';
import Select, {Props} from 'react-select';

const readableTextColor = 'var(--color_label-highlighted)';
const mutedTextColor = 'var(--color_label)';
const accentColor = 'var(--color_accent)';
const accentTextColor = 'var(--color_inside-accent)';

const customStyles = {
  option: (provided: any, state: any) => {
    return {
      ...provided,
      '&:hover': {
        backgroundColor: state.isSelected
          ? 'var(--color_accent)'
          : 'var(--bg_control)',
      },
      ':active': {
        backgroundColor: 'var(--bg_control)',
      },
      background: state.isSelected
        ? accentColor
        : state.isFocused
        ? 'var(--bg_control)'
        : 'var(--bg_menu)',
      color: state.isSelected
        ? accentTextColor
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
    color: state.isDisabled ? mutedTextColor : readableTextColor,
    opacity: 1,
  }),
  dropdownIndicator: (provided: any, state: any) => ({
    ...provided,
    color: state.isDisabled ? mutedTextColor : accentColor,
    opacity: state.isDisabled ? 0.75 : 1,
  }),
  indicatorSeparator: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isDisabled ? 'var(--bg_control)' : accentColor,
  }),
  menuList: (provided: any) => ({
    ...provided,
    borderColor: 'var(--color_accent)',
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
      borderColor: 'var(--color_accent)',
    },
    '&:hover': {
      borderColor: 'var(--color_accent)',
    },
    color: state.isDisabled ? mutedTextColor : readableTextColor,
    background: 'var(--bg_menu)',
  }),
  control: (provided: any, state: any) => {
    const res = {
      ...provided,
      boxShadow: 'none',
      ':active': {
        backgroundColor: 'transparent',
        borderColor: 'var(--color_accent)',
      },
      '&:hover': {
        borderColor: 'var(--color_accent)',
      },
      color: state.isDisabled ? mutedTextColor : readableTextColor,
      borderColor: state.isDisabled ? 'var(--bg_control)' : accentColor,
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
