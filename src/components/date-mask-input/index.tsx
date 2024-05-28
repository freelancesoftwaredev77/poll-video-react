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
    <div className="mb-2.5 relative">
      <label
        className={`font-semibold text-xs block mb-2 ${
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

      <div className="flex-1 relative">
        <input
          className={`w-full appearance-none rounded-lg py-3 px-4 block shadow-none placeholder:text-xs bg-white text-base placeholder:text-[#000000] focus-within:outline-none focus:outline-none ${
            meta.touched && meta.error
              ? 'text-warning placeholder:text-warning ring-1 ring-warning'
              : 'ring-primary ring-1'
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
          className="bg-warning text-white mt-1 text-xs inline-block px-2"
        />
      </div>
    </div>
  );
};

export default React.memo(DateInputMask);
