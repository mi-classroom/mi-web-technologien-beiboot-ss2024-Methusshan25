import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App';
import UploadImage from './pages/UploadImage'
import NotFoundPage from './pages/NotFoundPage';
import ProjectsView from './pages/ProjectsView';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFoundPage />
  },
  {
    path: '/upload',
    element: <UploadImage />,
    errorElement: <NotFoundPage />
  },{
    path: '/projects',
    element: <ProjectsView />
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />

  </React.StrictMode>,
)
