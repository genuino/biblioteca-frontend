import { Outlet } from 'react-router-dom';
import AppTheme from './shared-theme/AppTheme';
import AppAppBar from './components/AppAppBar';
import Footer from './components/Footer';

export default function Blog(props: { disableCustomTheme?: boolean }) {
  return (
    <AppTheme {...props}>
      <AppAppBar />
      <Outlet /> {/* Aqui serão renderizadas as páginas */}
      <Footer />
    </AppTheme>
  );
}