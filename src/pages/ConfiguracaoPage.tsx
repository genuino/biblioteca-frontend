import Container from '@mui/material/Container';
import Configuracao from '../components/Configuracao';

export default function ConfiguracaoPage() {
  return (
    <Container maxWidth="lg" component="main" sx={{ my: 4 }}>
      <Configuracao />
    </Container>
  );
}