import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { StyledEngineProvider } from '@mui/material/styles';
import Blog from './Blog';
import HomePage from './pages/HomePage';
import LivrosPage from './pages/LivrosPage';
import ReservaPage from './pages/ReservaPage';
import ConfiguracaoPage from './pages/ConfiguracaoPage';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Blog />}>
            <Route index element={<HomePage />} />
            <Route path="livros" element={<LivrosPage />} />
            <Route path="alunos" element={<div style={{ padding: '2rem' }}>Página de Alunos - Em construção</div>} />
            <Route path="reservas" element={<ReservaPage/>} />
            <Route path="configuracao" element={<ConfiguracaoPage/>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </StyledEngineProvider>
  </React.StrictMode>
);