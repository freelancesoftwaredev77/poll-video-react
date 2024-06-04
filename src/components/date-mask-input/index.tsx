import { ErrorMessage, useField } from 'formik';
import React from 'react';

interface IProps {
  label: string;
  isPrimary?: boolean;
  name: string;
}

const DateInputMask: React.FC<IProps> = ({ label, isPrimary, ...props }) => {
  const [field, meta, helpers] = useField(props);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 2) value = `${value.slice(0, 2)}-${value.slice(2)}`;
    if (value.length > 5) value = `${value.slice(0, 5)}-${value.slice(5)}`;
    helpers.setValue(value);
  };

  return (
    <div className="relative pb-3">
      <label
        className={`mb-2 block text-xs font-semibold ${
          meta.error && meta.touched ? 'text-warning' : 'text-secondary'
        }`}
        htmlFor={field.name}
      >
        {label}
        <span className="mx-1 text-warning">*</span>
      </label>

      <div className="relative flex-1">
        <input
          className={`block w-full appearance-none rounded bg-white px-4 py-1.5 text-base shadow-none placeholder:text-xs placeholder:text-[#000000] focus-within:outline-none focus:outline-none ${
            meta.touched && meta.error
              ? 'text-warning ring-1 ring-warning placeholder:text-warning'
              : 'ring-1 ring-primary'
          }`}
          autoComplete="off"
          {...field}
          onChange={handleChange}
          maxLength={10}
          placeholder="zz-ll-aaaa"
        />

        <ErrorMessage
          component="div"
          name={field.name}
          className="mt-1 inline-block bg-warning px-2 text-xs text-white"
        />
      </div>
    </div>
  );
};

export default React.memo(DateInputMask);
