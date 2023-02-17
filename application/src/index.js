import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App, {action as appAction, loader as appLoader} from './App';
import { createBrowserRouter, RouterProvider  } from 'react-router-dom';
import YtResult, { loader as YtResultLoader} from './routes/YtResult';
import RegistrationPage, {action as RegistrationAction} from './routes/RegistrationPage';
import MediaPlayer from './routes/MediaPlayer';
import ErrorPage from './routes/ErrorPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App/>,
    /*errorElement: <ErrorPage/>,*/
    loader: appLoader,
    action: appAction,
    children: [
      {
        path: 'yt-result/:videoId',
        element: <YtResult/>,
        loader: YtResultLoader,
      },
      {
        path: 'register',
        element: <RegistrationPage/>,
        action: RegistrationAction,
      },
      {
        path: 'play/:videoId',
        element: <MediaPlayer/>
      },
    ],
  },
]);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
