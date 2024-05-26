import * as React from 'react';
import { useField } from 'formik';
import Select from 'react-select';
import customStylesMain from '@/helpers/select-style';

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

  return (
    <div className={`mb-4 ${className}`}>
      <div className="relative inline-block">
        <label
          className="font-semibold text-xs text-primary block"
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

      {meta.touched && meta.error ? <div>{meta.error}</div> : null}
    </div>
  );
}

export default React.memo(CustomSelect);
