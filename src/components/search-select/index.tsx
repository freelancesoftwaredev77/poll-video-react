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
  name: string;
  onChange?: any;
}

export function CustomSelect({
  className,
  placeholder,
  name,
  options,
  isMulti = false,
  label = '',
  onChange,
}: CustomSelectProps) {
  const [field, meta, helpers] = useField(name);

  const handleChange = (selectedOptions: any) => {
    helpers.setValue(selectedOptions);
  };

  return (
    <div className={`mb-4 ${className}`}>
      <div className="relative inline-block">
        <label
          className="block text-xs font-semibold text-secondary"
          htmlFor={field.name}
        >
          {label}
          <span className="mx-1 text-warning">*</span>
        </label>
      </div>
      <Select
        className="mt-2 flex-1"
        options={options}
        {...field}
        onChange={onChange ?? handleChange}
        value={field.value}
        isMulti={isMulti}
        placeholder={placeholder}
        classNamePrefix="react-select"
        styles={customStylesMain}
        isSearchable={false}
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
