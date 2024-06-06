import React from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import {
  AgeError,
  Congratulations,
  Form,
  Home,
  TermsAndCondition,
  Thankyou,
} from './pages';
import Question from './pages/question';

const App: React.FC = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route path="/" element={<Home />} />
        <Route path="/form" element={<Form />} />
        <Route path="/age-error" element={<AgeError />} />
        <Route path="/question" element={<Question />} />
        <Route path="/congratulation" element={<Congratulations />} />
        <Route path="/terms-conditions" element={<TermsAndCondition />} />
        <Route path="/thank-you" element={<Thankyou />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};

export default App;
