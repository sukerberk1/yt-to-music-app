import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App, {action as appAction } from './App';
import { createBrowserRouter, RouterProvider  } from 'react-router-dom';
import YtResult, { loader as YtResultLoader } from './routes/YtResult';
import RegistrationPage, { action as RegistrationAction } from './routes/RegistrationPage';
import MediaPlayer, { loader as MediaPlayerLoader } from './routes/MediaPlayer';
import ErrorPage from './routes/ErrorPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App/>,
    errorElement: <ErrorPage/>,
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
        path: 'play/:videoPk',
        element: <MediaPlayer/>,
        loader: MediaPlayerLoader
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
