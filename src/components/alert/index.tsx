/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';

const Alert = ({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) => {
  const alertRef: React.MutableRefObject<any> = React.useRef(null);

  const handleClickOutside = (event: any) => {
    if (alertRef.current && !alertRef.current.contains(event.target)) {
      onClose();
    }
  };

  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    const handleBackButton = (event: any) => {
      event.preventDefault();
      onClose();
    };

    window.addEventListener('popstate', handleBackButton);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('popstate', handleBackButton);
    };
  }, [onClose]);

  return (
    <div className="alert-overlay">
      <div className="alert" ref={alertRef}>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Alert;
