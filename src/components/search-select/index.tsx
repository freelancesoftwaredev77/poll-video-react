import * as React from 'react';
import { useField } from 'formik';
import Select from 'react-select';

export interface SelectType {
  label: string;
  value: string;
}
interface CustomSelectProps {
  options: any;
  isMulti?: boolean;
  className?: string;
  placeholder?: string;
  label?: string;
  isPrimary?: boolean;
  name: string;
  onChange?: any;
}

export function CustomSelect({
  className,
  placeholder,
  name,
  options,
  isPrimary = true,
  isMulti = false,
  label = '',
  onChange,
}: CustomSelectProps) {
  const [field, meta, helpers] = useField(name);

  const handleChange = (selectedOptions: SelectType) => {
    const selectedValue = selectedOptions.value;
    helpers.setValue(selectedValue);
  };
  const customStylesMain = {
    control: (provided: any, state: any) => ({
      ...provided,
      border: state?.isFocused
        ? '1px solid #023656'
        : meta?.error
          ? '1px solid #EA4F3D'
          : '1px solid #0070D7',
      '&:hover': {
        border: meta?.error ? '1px solid #EA4F3D' : '1px solid #0070D7',
      },
      fontSize: '14px',
      color: '#EA4F3D',
    }),
    indicatorSeparator: () => ({
      display: 'none',
      color: meta?.error ? '#EA4F3D' : '',
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: meta?.error ? '#EA4F3D' : '#000000',
      fontSize: '12px',
    }),

    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#023656' : '#fff',
      color: state.isFocused ? 'white' : 'black',
      fontSize: '12px',
      '&:hover': {
        backgroundColor: '#023656',
        color: 'white',
      },
      zIndex: `99999999 !important`,
      top: 0,
    }),
  };

  return (
    <div className={`mb-4 ${className}`}>
      <div className="relative inline-block">
        <label
          className={
            meta.error
              ? 'font-semibold text-xs text-warning block'
              : 'font-semibold text-xs text-primary block'
          }
          htmlFor={field.name}
        >
          {label}
        </label>

        {isPrimary && (
          <p className="absolute -top-1 -right-2 text-warning font-semibold inline-block">
            *
          </p>
        )}
      </div>
      <Select
        className="flex-1 mt-2"
        options={options.map((option: SelectType) => ({
          label: option.label,
          value: option.value,
        }))}
        onChange={onChange ?? handleChange}
        isMulti={isMulti}
        placeholder={placeholder}
        classNamePrefix="react-select"
        isSearchable={false}
        styles={customStylesMain}
        theme={(theme) => ({
          ...theme,
          colors: {
            ...theme.colors,
            primary25: '#002a32cc',
            primary: '#002a32cc',
          },
        })}
      />

      {meta.error ? (
        <div className="bg-warning text-white mt-1 text-xs inline-block px-2">
          {meta.error}
        </div>
      ) : null}
    </div>
  );
}

export default React.memo(CustomSelect);
