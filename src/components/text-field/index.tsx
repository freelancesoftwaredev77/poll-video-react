import React from 'react';
import { ErrorMessage, FieldHookConfig, useField } from 'formik';

interface IProps {
  label?: string | number;
  placeholder?: string;
  type?: string;
  defaultValue?: string | number;
  readOnly?: boolean;
  hidden?: boolean;
  ref?: any;
  className?: string;
  onChange?: any;
  isLabel?: boolean;
  ringColor?: string;
  icon?: any;
}
function TextField({
  label,
  placeholder,
  type,
  readOnly,
  defaultValue,
  className,

  ...otherProps
}: IProps & FieldHookConfig<string>) {
  const [field, meta] = useField(otherProps);
  return (
    <div className={`${className} mb-2.5`}>
      <label
        className={`mb-2 text-xs block ${
          meta.error && meta.touched ? 'text-primary' : 'text-dark'
        }`}
        htmlFor={field.name}
      >
        {label}
      </label>

      <div className="flex-1">
        <input
          className={`w-full appearance-none rounded-lg py-3 px-4 block shadow-none ring-primary ring-1 placeholder:text-xs bg-pure-white text-xs text-dark focus-within:outline-none focus:outline-none"  ${
            meta.touched && meta.error
              ? ' text-primary placeholder:text-primary'
              : ''
          } `}
          {...field}
          type={type}
          placeholder={placeholder}
          defaultValue={defaultValue}
          autoComplete="off"
          readOnly={readOnly}
        />

        <ErrorMessage
          component="div"
          name={field.name}
          className="bg-primary text-white mt-1 text-xs inline-block px-2"
        />
      </div>
    </div>
  );
}

export default React.memo(TextField);
