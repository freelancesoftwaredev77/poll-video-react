/* eslint-disable react/react-in-jsx-scope */
import {
  AgeError,
  Congratulations,
  Demo,
  Form,
  Home,
  Question,
  TermsAndCondition,
} from '@/pages';

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
  {
    id: 5,
    path: '/congratulation',
    element: <Congratulations />,
  },
  {
    id: 6,
    path: '/terms-conditions',
    element: <TermsAndCondition />,
  },
];

export default routesData;
