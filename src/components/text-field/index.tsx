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
    <div className={`${className} relative mb-2.5`}>
      <label
        className={`mb-2 block  text-xs font-semibold  ${
          meta.error && meta.touched ? 'text-warning' : 'text-secondary'
        }`}
        htmlFor={field.name}
      >
        {label}
        {isPrimary && (
          <p className="absolute -top-1 inline-block font-bold text-warning">
            *
          </p>
        )}
      </label>

      <div className="flex-1">
        <input
          className={`block w-full appearance-none rounded bg-white px-4 py-1.5 text-base shadow-none placeholder:text-xs focus-within:outline-none focus:outline-none ${
            meta.touched && meta.error
              ? ' text-warning ring-1 ring-warning placeholder:text-warning'
              : ' ring-1 ring-primary '
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
          className="mt-1 inline-block bg-warning px-2 text-xs text-white"
        />
      </div>
    </div>
  );
}

export default React.memo(TextField);
