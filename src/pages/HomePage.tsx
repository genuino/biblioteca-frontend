import Container from '@mui/material/Container';
import BlogTableView from '../components/BlogTableView';

export default function HomePage() {
  return (
    <Container maxWidth="lg" component="main" sx={{ my: 4 }}>
      <BlogTableView />
    </Container>
  );
}