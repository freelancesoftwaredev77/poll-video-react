import React from 'react';
import { Route, Routes } from 'react-router-dom';
import routesData from './routes';

const App: React.FC = () => (
  <Routes>
    {routesData.map((item) => (
      <Route key={item?.id} path={item?.path} element={item?.element} />
    ))}
  </Routes>
);

export default App;
