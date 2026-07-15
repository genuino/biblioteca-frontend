import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';

const cardData = [
  {
    img: 'https://picsum.photos/800/450?random=1',
    tag: 'Engineering',
    title: 'Revolutionizing software development with cutting-edge tools',
    description: 'Our latest engineering tools are designed to streamline workflows and boost productivity.',
    authors: [
      { name: 'Remy Sharp', avatar: '/static/images/avatar/1.jpg' },
      { name: 'Travis Howard', avatar: '/static/images/avatar/2.jpg' },
    ],
  },
  {
    img: 'https://picsum.photos/800/450?random=2',
    tag: 'Product',
    title: 'Innovative product features that drive success',
    description: 'Explore the key features of our latest product release.',
    authors: [{ name: 'Erica Johns', avatar: '/static/images/avatar/6.jpg' }],
  },
  {
    img: 'https://picsum.photos/800/450?random=3',
    tag: 'Design',
    title: 'Designing for the future: trends and insights',
    description: 'Stay ahead of the curve with the latest design trends.',
    authors: [{ name: 'Kate Morrison', avatar: '/static/images/avatar/7.jpg' }],
  },
  {
    img: 'https://picsum.photos/800/450?random=4',
    tag: 'Company',
    title: "Our company's journey: milestones and achievements",
    description: "Take a look at our company's journey and milestones.",
    authors: [{ name: 'Cindy Baker', avatar: '/static/images/avatar/3.jpg' }],
  },
  {
    img: 'https://picsum.photos/800/450?random=45',
    tag: 'Engineering',
    title: 'Pioneering sustainable engineering solutions',
    description: 'Learn about our commitment to sustainability.',
    authors: [
      { name: 'Agnes Walker', avatar: '/static/images/avatar/4.jpg' },
      { name: 'Trevor Henderson', avatar: '/static/images/avatar/5.jpg' },
    ],
  },
  {
    img: 'https://picsum.photos/800/450?random=6',
    tag: 'Product',
    title: 'Maximizing efficiency with our latest product updates',
    description: 'Our recent product updates help you maximize efficiency.',
    authors: [{ name: 'Travis Howard', avatar: '/static/images/avatar/2.jpg' }],
  },
];

export default function BlogTableView() {
  const [imageErrors, setImageErrors] = React.useState<{ [key: number]: boolean }>({});

  const handleImageError = (index: number) => {
    setImageErrors(prev => ({ ...prev, [index]: true }));
  };

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Blog Posts - Visualização em Tabela
      </Typography>
      
      <TableContainer component={Paper} elevation={2}>
        <Table sx={{ minWidth: 650 }} aria-label="blog posts table">
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.main' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', width: 120 }}>
                Imagem
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', width: 100 }}>
                Categoria
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                Título
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                Descrição
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', width: 150 }}>
                Autores
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cardData.map((article, index) => (
              <TableRow
                key={index}
                sx={{
                  '&:nth-of-type(odd)': { backgroundColor: 'action.hover' },
                  '&:hover': { backgroundColor: 'action.selected' },
                }}
              >
                <TableCell>
                  {imageErrors[index] ? (
                    <Box
                      sx={{
                        width: 100,
                        height: 60,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'grey.300',
                        borderRadius: 1,
                        p: 1,
                      }}
                    >
                      <Typography variant="caption" color="text.secondary" align="center">
                        {article.title.substring(0, 20)}...
                      </Typography>
                    </Box>
                  ) : (
                    <img
                      src={article.img}
                      alt={article.title}
                      style={{
                        width: 100,
                        height: 60,
                        objectFit: 'cover',
                        borderRadius: 4,
                      }}
                      onError={() => handleImageError(index)}
                    />
                  )}
                </TableCell>
                
                <TableCell>
                  <Chip
                    label={article.tag}
                    size="small"
                    color={
                      article.tag === 'Engineering'
                        ? 'primary'
                        : article.tag === 'Product'
                        ? 'success'
                        : article.tag === 'Design'
                        ? 'secondary'
                        : 'default'
                    }
                  />
                </TableCell>
                
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {article.title}
                  </Typography>
                </TableCell>
                
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {article.description}
                  </Typography>
                </TableCell>
                
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AvatarGroup max={2}>
                      {article.authors.map((author, authorIndex) => (
                        <Avatar key={authorIndex} alt={author.name} sx={{ width: 28, height: 28 }}>
                          {author.name.charAt(0)}
                        </Avatar>
                      ))}
                    </AvatarGroup>
                    <Typography variant="caption" sx={{ display: { xs: 'none', md: 'block' } }}>
                      {article.authors.length > 1 ? `${article.authors.length} autores` : article.authors[0].name}
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}