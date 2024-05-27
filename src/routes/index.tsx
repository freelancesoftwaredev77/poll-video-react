/* eslint-disable react/react-in-jsx-scope */
import { AgeError, Demo, Form, Home, Question } from '@/pages';

const routesData = [
  {
    id: 0,
    path: '/',
    element: <Home />,
  },
  {
    id: 1,
    path: '/age-error',
    element: <AgeError />,
  },

  {
    id: 2,
    path: '/question',
    element: <Question />,
  },

  {
    id: 3,
    path: '/form',
    element: <Form />,
  },
  {
    id: 4,
    path: '/demo',
    element: <Demo />,
  },
];

export default routesData;
