import Container from '@mui/material/Container';
import Reserva from '../components/Reserva';

export default function LivrosPage() {
  return (
    <Container maxWidth="lg" component="main" sx={{ my: 4 }}>
      <Reserva />
    </Container>
  );
}