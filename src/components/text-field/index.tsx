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
  isPrimary?: boolean;
}
function TextField({
  label,
  placeholder,
  type,
  readOnly,
  defaultValue,
  className,
  isPrimary = true,
  ...otherProps
}: IProps & FieldHookConfig<string>) {
  const [field, meta] = useField(otherProps);
  return (
    <div className={`${className} mb-2.5 relative`}>
      <label
        className={`font-semibold text-xs  block mb-2  ${
          meta.error && meta.touched ? 'text-warning' : 'text-primary'
        }`}
        htmlFor={field.name}
      >
        {label}
        {isPrimary && (
          <p className="absolute -top-1 text-warning font-bold inline-block">
            *
          </p>
        )}
      </label>

      <div className="flex-1">
        <input
          className={`w-full appearance-none rounded-lg py-3 px-4 block shadow-none placeholder:text-xs bg-pure-white text-xs text-dark focus-within:outline-none focus:outline-none"  ${
            meta.touched && meta.error
              ? ' text-warning placeholder:text-warning ring-1 ring-warning'
              : ' ring-primary ring-1 '
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
          className="bg-warning text-white mt-1 text-xs inline-block px-2"
        />
      </div>
    </div>
  );
}

export default React.memo(TextField);
