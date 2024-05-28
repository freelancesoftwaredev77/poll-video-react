const customStylesMain = {
  control: (provided: any, state: any) => ({
    ...provided,
    border: state?.isFocused ? '1px solid #023656' : '1px solid #0070D7',
    '&:hover': {
      border: '1px solid #0070D7',
    },
    fontSize: '14px',
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: '#16161C',
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
export default customStylesMain;
