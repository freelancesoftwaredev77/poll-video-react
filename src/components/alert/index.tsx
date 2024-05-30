/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const useBackButtonAlert = (homePath: string = '/') => {
  const location = useLocation();
  const navigate = useNavigate();

  const [showAlert, setShowAlert] = useState(false);

  console.log('show alert', showAlert);

  useEffect(() => {
    const handleBackButton = () => {
      if (location.pathname !== homePath && !showAlert) {
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
        window.history.pushState(null, document.title, window.location.href);
      } else if (location.pathname !== homePath && showAlert) {
        navigate(homePath);
      }
    };

    window.addEventListener('popstate', handleBackButton);

    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, []);

  return showAlert;
};

export default useBackButtonAlert;
