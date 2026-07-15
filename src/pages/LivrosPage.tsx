import Container from '@mui/material/Container';
import CadastroLivro from '../components/CadastroLivro';

export default function LivrosPage() {
  return (
    <Container maxWidth="lg" component="main" sx={{ my: 4 }}>
      <CadastroLivro />
    </Container>
  );
}