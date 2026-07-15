import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import InputAdornment from '@mui/material/InputAdornment';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
interface Autor {
  id?: number;
  nome: string;
  foto?: string;
  observacao?: string;
}
interface Livro {
  id?: number;
  titulo: string;
  autores: Autor[];  // ← Mudou de string para array de Autor
  isbn: string;
  editora: string;
  edicao: string;
  publicacao: string;
  categoria: string;
  quantidade: string;
  localizacao: string;
  descricao: string;
  imagemCapa: string | null;
}

interface Categoria {
  id: string;
  name: string;
  children?: Categoria[];
}

const categoriasIniciais: Categoria[] = [
  {
    id: 'ficcao',
    name: 'Ficção',
    children: [
      { id: 'ficcao-romance', name: 'Romance' },
      { id: 'ficcao-suspense', name: 'Suspense' },
      { id: 'ficcao-fantasia', name: 'Fantasia' },
      { id: 'ficcao-sci-fi', name: 'Ficção Científica' },
    ],
  },
  {
    id: 'nao-ficcao',
    name: 'Não-ficção',
    children: [
      { id: 'nao-ficcao-biografia', name: 'Biografia' },
      { id: 'nao-ficcao-historia', name: 'História' },
      { id: 'nao-ficcao-ciencia', name: 'Ciência' },
    ],
  },
  {
    id: 'tecnico',
    name: 'Técnico',
    children: [
      { id: 'tecnico-programacao', name: 'Programação' },
      { id: 'tecnico-engenharia', name: 'Engenharia' },
      { id: 'tecnico-medicina', name: 'Medicina' },
    ],
  },
  {
    id: 'educacional',
    name: 'Educacional',
    children: [
      { id: 'educacional-infantil', name: 'Infantil' },
      { id: 'educacional-fundamental', name: 'Ensino Fundamental' },
      { id: 'educacional-medio', name: 'Ensino Médio' },
    ],
  },
  {
    id: 'outros',
    name: 'Outros',
    children: [],
  },
];

function CategoriaTreeItem({ 
  categoria, 
  categoriaSelecionada, 
  onSelect, 
  onAddSubcategory,
  onDeleteCategory,
  onRenameCategory,
  adicionandoEm,
  renomeandoId,
  renderNovaSubcategoriaInput,
  renderRenomearInput,
  nivel = 0 
}: { 
  categoria: Categoria; 
  categoriaSelecionada: string; 
  onSelect: (id: string, name: string) => void;
  onAddSubcategory: (parentId: string) => void;
  onDeleteCategory: (id: string) => void;
  onRenameCategory: (id: string) => void;
  adicionandoEm: string | null;
  renomeandoId: string | null;
  renderNovaSubcategoriaInput: (parentId: string) => React.ReactNode;
  renderRenomearInput: (id: string, currentName: string) => React.ReactNode;
  nivel?: number;
}) {
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);
  const hasChildren = categoria.children && categoria.children.length > 0;

  const handleClick = () => {
    if (hasChildren || adicionandoEm === categoria.id) {
      setOpen(!open);
    }
    onSelect(categoria.id, categoria.name);
  };

  const handleMenuClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAddClick = () => {
    handleMenuClose();
    setOpen(true);
    onAddSubcategory(categoria.id);
  };

  const handleDeleteClick = () => {
    handleMenuClose();
    onDeleteCategory(categoria.id);
  };

  const handleRenameClick = () => {
    handleMenuClose();
    onRenameCategory(categoria.id);
  };

  // Se está renomeando esta categoria, mostra o input
  if (renomeandoId === categoria.id) {
    return renderRenomearInput(categoria.id, categoria.name);
  }

  return (
    <>
      <ListItemButton
        onClick={handleClick}
        selected={categoriaSelecionada === categoria.id}
        sx={{
          pl: 2 + nivel * 2,
          backgroundColor: categoriaSelecionada === categoria.id ? 'primary.light' : 'transparent',
          '&.Mui-selected': {
            backgroundColor: 'primary.light',
            color: 'white',
            '&:hover': {
              backgroundColor: 'primary.main',
            },
          },
        }}
      >
        {(hasChildren || adicionandoEm === categoria.id) && (
          open ? <ExpandMoreIcon fontSize="small" /> : <ChevronRightIcon fontSize="small" />
        )}
        <ListItemText 
          primary={categoria.name} 
          sx={{ ml: (hasChildren || adicionandoEm === categoria.id) ? 0 : 3 }}
        />
        {categoriaSelecionada === categoria.id && (
          <IconButton
            size="small"
            onClick={handleMenuClick}
            sx={{ 
              color: 'white',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' }
            }}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
        )}
      </ListItemButton>

      {/* Menu de contexto */}
      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        onClick={(e) => e.stopPropagation()}
      >
        <MenuItem onClick={handleAddClick}>
          <ListItemIcon>
            <AddIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Adicionar subcategoria</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleRenameClick}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Renomear</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Excluir</ListItemText>
        </MenuItem>
      </Menu>

      {(hasChildren || adicionandoEm === categoria.id) && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {categoria.children?.map((child) => (
              <CategoriaTreeItem
                key={child.id}
                categoria={child}
                categoriaSelecionada={categoriaSelecionada}
                onSelect={onSelect}
                onAddSubcategory={onAddSubcategory}
                onDeleteCategory={onDeleteCategory}
                onRenameCategory={onRenameCategory}
                adicionandoEm={adicionandoEm}
                renomeandoId={renomeandoId}
                renderNovaSubcategoriaInput={renderNovaSubcategoriaInput}
                renderRenomearInput={renderRenomearInput}
                nivel={nivel + 1}
              />
            ))}
            {adicionandoEm === categoria.id && renderNovaSubcategoriaInput(categoria.id)}
          </List>
        </Collapse>
      )}
    </>
  );
}

export default function CadastroLivro() {
  const [livro, setLivro] = React.useState<Livro>({
    titulo: '',
    autores: [],
    isbn: '',
    editora: '',
    edicao: '',
    categoria: '',
    publicacao: '',
    quantidade: '',
    localizacao: '',
    descricao: '',
    imagemCapa: null,
  });

  const [categorias, setCategorias] = React.useState<Categoria[]>(categoriasIniciais);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [mensagem, setMensagem] = React.useState('');
  const [tipoMensagem, setTipoMensagem] = React.useState<'success' | 'error'>('success');
  const [categoriaSelecionada, setCategoriaSelecionada] = React.useState<string>('');
  const [categoriaNome, setCategoriaNome] = React.useState<string>('');
  const [adicionandoEm, setAdicionandoEm] = React.useState<string | null>(null);
  const [renomeandoId, setRenomeandoId] = React.useState<string | null>(null);
  const [novaSubcategoria, setNovaSubcategoria] = React.useState<string>('');
  const [novoNome, setNovoNome] = React.useState<string>('');
  const [dialogExcluir, setDialogExcluir] = React.useState<{ open: boolean; id: string; nome: string }>({
    open: false,
    id: '',
    nome: '',
  });
  const [adicionandoRaiz, setAdicionandoRaiz] = React.useState(false);
  const [novaCategoriaRaiz, setNovaCategoriaRaiz] = React.useState('');
  const [anchorElMenu, setAnchorElMenu] = React.useState<null | HTMLElement>(null);
  const [dialogQRCode, setDialogQRCode] = React.useState<{ 
    open: boolean; 
    livro: Livro | null; 
    qrCodeUrl: string 
  }>({
    open: false,
    livro: null,
    qrCodeUrl: '',
  });
  const menuRaizOpen = Boolean(anchorElMenu);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const renameInputRef = React.useRef<HTMLInputElement>(null);
  const raizInputRef = React.useRef<HTMLInputElement>(null);
  const [autoresDisponiveis, setAutoresDisponiveis] = React.useState<Autor[]>([]);
  const [inputAutor, setInputAutor] = React.useState('');
  const [buscandoAutor, setBuscandoAutor] = React.useState(false);
  const [processandoEnter, setProcessandoEnter] = React.useState(false);

  React.useEffect(() => {
    if (adicionandoEm && inputRef.current) {
      inputRef.current.focus();
    }
  }, [adicionandoEm]);

  React.useEffect(() => {
    if (renomeandoId && renameInputRef.current) {
      renameInputRef.current.focus();
    }
  }, [renomeandoId]);

  React.useEffect(() => {
    if (adicionandoRaiz && raizInputRef.current) {
      raizInputRef.current.focus();
    }
  }, [adicionandoRaiz]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLivro(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoriaSelect = (id: string, name: string) => {
    setCategoriaSelecionada(id);
    setCategoriaNome(name);
    setLivro(prev => ({
      ...prev,
      categoria: id,
    }));
  };

  const handleAddSubcategory = (parentId: string) => {
    setAdicionandoEm(parentId);
    setNovaSubcategoria('');
    setRenomeandoId(null);
  };

  const handleMenuRaizClick = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorElMenu(e.currentTarget);
  };

  const handleMenuRaizClose = () => {
    setAnchorElMenu(null);
  };

  const handleAddCategoriaRaiz = () => {
    handleMenuRaizClose();
    setAdicionandoRaiz(true);
    setNovaCategoriaRaiz('');
  };

  const adicionarCategoriaRaiz = () => {
    if (!novaCategoriaRaiz.trim()) return;

    const timestamp = Date.now();
    const novoId = `${novaCategoriaRaiz.toLowerCase().replace(/\s+/g, '-')}-${timestamp}`;
    
    const novaCategoria: Categoria = {
      id: novoId,
      name: novaCategoriaRaiz.trim(),
      children: []
    };

    setCategorias([...categorias, novaCategoria]);
    setMensagem('Categoria adicionada com sucesso!');
    setTipoMensagem('success');
    setOpenSnackbar(true);
    setAdicionandoRaiz(false);
    setNovaCategoriaRaiz('');
  };

  const adicionarSubcategoria = () => {
    if (!novaSubcategoria.trim() || !adicionandoEm) return;

    const timestamp = Date.now();
    const novoId = `${adicionandoEm}-${novaSubcategoria.toLowerCase().replace(/\s+/g, '-')}-${timestamp}`;
    
    const adicionarNaArvore = (cats: Categoria[]): Categoria[] => {
      return cats.map(cat => {
        if (cat.id === adicionandoEm) {
          const novaCategoria: Categoria = {
            id: novoId,
            name: novaSubcategoria.trim(),
            children: []
          };
          return {
            ...cat,
            children: [...(cat.children || []), novaCategoria]
          };
        }
        if (cat.children && cat.children.length > 0) {
          return {
            ...cat,
            children: adicionarNaArvore(cat.children)
          };
        }
        return cat;
      });
    };

    setCategorias(adicionarNaArvore(categorias));
    setMensagem('Subcategoria adicionada com sucesso!');
    setTipoMensagem('success');
    setOpenSnackbar(true);
    setAdicionandoEm(null);
    setNovaSubcategoria('');
  };

  const handleDeleteCategory = (id: string) => {
    const encontrarNome = (cats: Categoria[]): string => {
      for (const cat of cats) {
        if (cat.id === id) return cat.name;
        if (cat.children) {
          const nome = encontrarNome(cat.children);
          if (nome) return nome;
        }
      }
      return '';
    };

    setDialogExcluir({ open: true, id, nome: encontrarNome(categorias) });
  };

  const confirmarExclusao = () => {
    const { id } = dialogExcluir;

    const removerDaArvore = (cats: Categoria[]): Categoria[] => {
      return cats
        .filter(cat => cat.id !== id)
        .map(cat => ({
          ...cat,
          children: cat.children ? removerDaArvore(cat.children) : []
        }));
    };

    setCategorias(removerDaArvore(categorias));
    
    if (categoriaSelecionada === id) {
      setCategoriaSelecionada('');
      setCategoriaNome('');
    }

    setMensagem('Categoria excluída com sucesso!');
    setTipoMensagem('success');
    setOpenSnackbar(true);
    setDialogExcluir({ open: false, id: '', nome: '' });
  };

  const handleRenameCategory = (id: string) => {
    setRenomeandoId(id);
    setAdicionandoEm(null);
    
    const encontrarNome = (cats: Categoria[]): string => {
      for (const cat of cats) {
        if (cat.id === id) return cat.name;
        if (cat.children) {
          const nome = encontrarNome(cat.children);
          if (nome) return nome;
        }
      }
      return '';
    };

    setNovoNome(encontrarNome(categorias));
  };

  const renomearCategoria = () => {
    if (!novoNome.trim() || !renomeandoId) return;

    const renomearNaArvore = (cats: Categoria[]): Categoria[] => {
      return cats.map(cat => {
        if (cat.id === renomeandoId) {
          return { ...cat, name: novoNome.trim() };
        }
        if (cat.children) {
          return {
            ...cat,
            children: renomearNaArvore(cat.children)
          };
        }
        return cat;
      });
    };

    setCategorias(renomearNaArvore(categorias));
    
    if (categoriaSelecionada === renomeandoId) {
      setCategoriaNome(novoNome.trim());
    }

    setMensagem('Categoria renomeada com sucesso!');
    setTipoMensagem('success');
    setOpenSnackbar(true);
    setRenomeandoId(null);
    setNovoNome('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      adicionarSubcategoria();
    } else if (e.key === 'Escape') {
      setAdicionandoEm(null);
      setNovaSubcategoria('');
    }
  };

  const handleRenameKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      renomearCategoria();
    } else if (e.key === 'Escape') {
      setRenomeandoId(null);
      setNovoNome('');
    }
  };

  const handleRaizKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      adicionarCategoriaRaiz();
    } else if (e.key === 'Escape') {
      setAdicionandoRaiz(false);
      setNovaCategoriaRaiz('');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setMensagem('Por favor, selecione apenas arquivos de imagem!');
        setTipoMensagem('error');
        setOpenSnackbar(true);
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setMensagem('A imagem deve ter no máximo 5MB!');
        setTipoMensagem('error');
        setOpenSnackbar(true);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setLivro(prev => ({
          ...prev,
          imagemCapa: reader.result as string,
        }));
        setMensagem('Imagem carregada com sucesso!');
        setTipoMensagem('success');
        setOpenSnackbar(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setLivro(prev => ({
      ...prev,
      imagemCapa: null,
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const buscarAutores = async (nome: string) => {
    if (nome.length < 2) {
      setAutoresDisponiveis([]);
      return;
    }

    setBuscandoAutor(true);
    try {
      const response = await fetch(`http://localhost:8080/api/autores/buscar?nome=${encodeURIComponent(nome)}`);
      if (response.ok) {
        const autores = await response.json();
        setAutoresDisponiveis(autores);
      }
    } catch (error) {
      console.error('Erro ao buscar autores:', error);
    } finally {
      setBuscandoAutor(false);
    }
  };

  // Debounce para não fazer muitas requisições
  React.useEffect(() => {
    const timer = setTimeout(() => {
      buscarAutores(inputAutor);
    }, 300);

    return () => clearTimeout(timer);
  }, [inputAutor]);

  const criarNovoAutor = async (nomeAutor: string) => {
    if (!nomeAutor.trim()) return;

    console.debug('Prestes a entrar no localhost:8081/api/autores');
    try {
      const response = await fetch('http://localhost:8081/api/autores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome: nomeAutor.trim() }),
    });
    console.debug('Passou pelo localhost:8081/api/autores');

    if (response.ok) {
      const novoAutor = await response.json();
      
      setInputAutor('');
      // Adicionar ao livro
      {/*setLivro(prev => ({
        ...prev,
        autores: [...prev.autores, novoAutor]
      }));*/}

      setMensagem('Autor criado e adicionado com sucesso!');
      setTipoMensagem('success');
      setOpenSnackbar(true);
      
    } else {
      throw new Error('Erro ao criar autor');
    }
    } catch (error) {
      console.error('Erro ao criar autor:', error);
      setMensagem('Erro ao criar autor. Tente novamente.');
      setTipoMensagem('error');
      setOpenSnackbar(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!livro.titulo || livro.autores.length === 0 || !livro.isbn) {
      setMensagem('Por favor, preencha os campos obrigatórios!');
      setTipoMensagem('error');
      setOpenSnackbar(true);
      return;
    }

    try {
      const livroFormatado = formatarLivroParaBackend(livro);
    
      // Chamada ao backend
      const response = await fetch('http://localhost:8080/api/livros', {  // Ajuste a porta
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(livroFormatado),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao cadastrar livro');
    }

    const data = await response.json();
    // Esperado: { id: 1, titulo: '...', qrCodeUrl: 'https://...' }
    
    console.log('Livro cadastrado:', data);
    
    // Abrir dialog com QR Code
    setDialogQRCode({ 
      open: true, 
      livro: { ...livro },
      qrCodeUrl: data.qrCodeUrl 
    });
    
    handleLimpar();

  } catch (error: any) {
    console.error('Erro ao cadastrar livro:', error);
    setMensagem(error.message || 'Erro ao cadastrar livro. Tente novamente.');
    setTipoMensagem('error');
    setOpenSnackbar(true);
  }
};

  const handleLimpar = () => {
    setLivro({
      titulo: '',
      autores: [],
      isbn: '',
      editora: '',
      edicao: '',
      categoria: '',
      publicacao: '',
      quantidade: '',
      localizacao: '',
      descricao: '',
      imagemCapa: null,
    });
    setCategoriaSelecionada('');
    setCategoriaNome('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatarLivroParaBackend = (livroForm: Livro) => {
  return {
    titulo: livroForm.titulo,
    isbn: livroForm.isbn,
    editora: livroForm.editora,
    localizacao: livroForm.localizacao,
    descricao: livroForm.descricao,
    publicacao: livroForm.publicacao,
    edicao: parseInt(livroForm.edicao) || 1,
    genero: {
      id: livroForm.categoria  // Assumindo que categoria é o ID do gênero
    },
    autores: livroForm.autores,
    valor: 0.0,  // Você pode adicionar campo de valor no formulário
    copia: parseInt(livroForm.quantidade) || 1
  };
};

  const imprimirQRCode = () => {
    if (!dialogQRCode.livro || !dialogQRCode.qrCodeUrl) return;
  
    const printWindow = window.open('', '_blank');
    if (printWindow) {
        printWindow.document.write(`
        <html>
            <head>
            <title>QR Code - ${dialogQRCode.livro.titulo}</title>
            <style>
                body { 
                display: flex; 
                flex-direction: column; 
                align-items: center; 
                justify-content: center; 
                min-height: 100vh;
                font-family: Arial, sans-serif;
                padding: 20px;
                }
                h2 { margin-bottom: 10px; }
                img { margin: 20px 0; border: 2px solid #333; padding: 10px; max-width: 300px; }
                .info { text-align: center; margin-top: 20px; }
                @media print {
                button { display: none; }
                }
            </style>
            </head>
            <body>
            <h2>${dialogQRCode.livro.titulo}</h2>
            <p><strong>Autor:</strong> ${dialogQRCode.livro.autores}</p>
            <p><strong>ISBN:</strong> ${dialogQRCode.livro.isbn}</p>
            <img src="${dialogQRCode.qrCodeUrl}" alt="QR Code do Livro" crossorigin="anonymous" />
            <div class="info">
                <p><strong>Localização:</strong> ${dialogQRCode.livro.localizacao || 'Não informado'}</p>
            </div>
            <button onclick="window.print()" style="margin-top: 20px; padding: 10px 20px; font-size: 16px; cursor: pointer;">
                Imprimir
            </button>
            </body>
        </html>
        `);
        printWindow.document.close();
    }
  
  setDialogQRCode({ open: false, livro: null, qrCodeUrl: '' });
  setMensagem('Livro cadastrado com sucesso!');
  setTipoMensagem('success');
  setOpenSnackbar(true);
};

  const renderNovaSubcategoriaInput = (parentId: string) => {
    const encontrarNivel = (cats: Categoria[], id: string, nivelAtual = 0): number => {
      for (const cat of cats) {
        if (cat.id === id) return nivelAtual;
        if (cat.children) {
          const resultado = encontrarNivel(cat.children, id, nivelAtual + 1);
          if (resultado !== -1) return resultado;
        }
      }
      return -1;
    };

    const nivel = encontrarNivel(categorias, parentId);

    return (
      <Box sx={{ pl: 2 + (nivel + 1) * 2, pr: 2, py: 1 }}>
        <TextField
          inputRef={inputRef}
          size="small"
          fullWidth
          placeholder="Nome da nova subcategoria"
          value={novaSubcategoria}
          onChange={(e) => setNovaSubcategoria(e.target.value)}
          onKeyDown={handleKeyPress}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={adicionarSubcategoria}
                  color="primary"
                  disabled={!novaSubcategoria.trim()}
                >
                  <CheckIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => {
                    setAdicionandoEm(null);
                    setNovaSubcategoria('');
                  }}
                  color="error"
                >
                  <CloseIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          helperText="Enter para adicionar, Esc para cancelar"
        />
      </Box>
    );
  };

  const renderRenomearInput = (id: string, currentName: string) => {
    const encontrarNivel = (cats: Categoria[], searchId: string, nivelAtual = 0): number => {
      for (const cat of cats) {
        if (cat.id === searchId) return nivelAtual;
        if (cat.children) {
          const resultado = encontrarNivel(cat.children, searchId, nivelAtual + 1);
          if (resultado !== -1) return resultado;
        }
      }
      return 0;
    };

    const nivel = encontrarNivel(categorias, id);

    return (
      <Box sx={{ pl: 2 + nivel * 2, pr: 2, py: 1, backgroundColor: 'primary.light' }}>
        <TextField
          inputRef={renameInputRef}
          size="small"
          fullWidth
          value={novoNome}
          onChange={(e) => setNovoNome(e.target.value)}
          onKeyDown={handleRenameKeyPress}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={renomearCategoria}
                  color="primary"
                  disabled={!novoNome.trim()}
                >
                  <CheckIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => {
                    setRenomeandoId(null);
                    setNovoNome('');
                  }}
                  color="error"
                >
                  <CloseIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          helperText="Enter para renomear, Esc para cancelar"
        />
      </Box>
    );
  };

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom color="primary" sx={{ mb: 3 }}>
          📚 Cadastro de Livro
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Coluna da Imagem */}
            <Grid item xs={12} md={3}>
              <Box sx={{ position: 'sticky', top: 20 }}>
                <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                  Capa do Livro
                </Typography>
                
                {livro.imagemCapa ? (
                  <Box sx={{ position: 'relative' }}>
                    <Card elevation={2}>
                      <CardMedia
                        component="img"
                        image={livro.imagemCapa}
                        alt="Capa do livro"
                        sx={{
                          height: 400,
                          objectFit: 'contain',
                          backgroundColor: 'grey.100',
                        }}
                      />
                    </Card>
                    <IconButton
                      onClick={handleRemoveImage}
                      color="error"
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        backgroundColor: 'white',
                        '&:hover': { backgroundColor: 'grey.100' },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      height: 400,
                      border: '2px dashed',
                      borderColor: 'grey.400',
                      borderRadius: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'grey.50',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      '&:hover': {
                        borderColor: 'primary.main',
                        backgroundColor: 'grey.100',
                      },
                    }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <CloudUploadIcon sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
                    <Typography variant="body1" color="text.secondary" align="center">
                      Clique para adicionar a capa
                    </Typography>
                    <Typography variant="caption" color="text.secondary" align="center" sx={{ mt: 1 }}>
                      JPG, PNG ou GIF (máx. 5MB)
                    </Typography>
                  </Box>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />

                {!livro.imagemCapa && (
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<CloudUploadIcon />}
                    onClick={() => fileInputRef.current?.click()}
                    sx={{ mt: 2 }}
                  >
                    Selecionar Imagem
                  </Button>
                )}
              </Box>
            </Grid>

            {/* Coluna dos Campos */}
            <Grid item xs={12} md={6}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Título do Livro"
                    name="titulo"
                    value={livro.titulo}
                    onChange={handleChange}
                    placeholder="Ex: Dom Casmurro"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                    <Autocomplete
                        multiple
                        freeSolo
                        options={autoresDisponiveis}
                        getOptionLabel={(option) => typeof option === 'string' ? option : option.nome}
                        value={livro.autores}
                        inputValue={inputAutor}
                        onInputChange={(event, newInputValue) => {
                            setInputAutor(newInputValue);
                        }}
                        onChange={(event, newValue) => {
                            
                            // Se está processando Enter, ignorar onChange
                            if (processandoEnter) {
                                setProcessandoEnter(false);
                                return;
                            }

                            const novosAutores = newValue.map(item => {
                                if (typeof item === 'string') {
                                    // Novo autor digitado
                                    return { nome: item };
                                }
                                return item;
                            });
                            setLivro(prev => ({ ...prev, autores: novosAutores }));
                        }}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter' && inputAutor.trim()) {
                                
                                event.preventDefault();
                                event.stopPropagation();
                                setProcessandoEnter(true);

                                console.debug("Entrou aqui event.key === 'Enter'");
                                // Verificar se já existe na lista
                                const autorExiste = autoresDisponiveis.find(
                                    a => a.nome.toLowerCase() === inputAutor.toLowerCase()
                                );
                            
                                if (autorExiste) {
                                    // Adicionar autor existente
                                    setLivro(prev => ({
                                        ...prev,
                                        autores: [...prev.autores, autorExiste]
                                    }));
                                    setInputAutor('');
                                } else {
                                    // Criar novo autor
                                    criarNovoAutor(inputAutor);
                                }
                            }
                        }}
                        loading={buscandoAutor}
                        renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                            <Chip
                            label={option.nome}
                            {...getTagProps({ index })}
                            color="primary"
                            variant="outlined"
                            />
                        ))
                        }
                        renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Autores"
                            placeholder="Digite o nome e pressione Enter"
                            helperText="Digite o nome do autor e pressione Enter para adicionar"
                        />
                        )}
                        renderOption={(props, option) => (
                            <li {...props}>
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                            <Typography variant="body2">{option.nome}</Typography>
                                                {option.observacao && (
                                            <Typography variant="caption" color="text.secondary">
                                                {option.observacao}
                                            </Typography>
                                )}
                                </Box>
                            </li>
                        )}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    required
                    fullWidth
                    label="ISBN"
                    name="isbn"
                    value={livro.isbn}
                    onChange={handleChange}
                    placeholder="Ex: 978-3-16-148410-0"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Editora"
                    name="editora"
                    value={livro.editora}
                    onChange={handleChange}
                    placeholder="Ex: Companhia das Letras"
                  />
                </Grid>
				
				
				
				<Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Ano de Publicação"
                name="anoPublicacao"
                type="number"
                value={livro.publicacao}
                onChange={handleChange}
                placeholder="Ex: 2024"
                inputProps={{ min: 1000, max: new Date().getFullYear() }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Quantidade"
                name="quantidade"
                type="number"
                value={livro.quantidade}
                onChange={handleChange}
                placeholder="Ex: 5"
                inputProps={{ min: 0 }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Localização na Biblioteca"
                name="localizacao"
                value={livro.localizacao}
                onChange={handleChange}
                placeholder="Ex: Estante A - Prateleira 3"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Descrição"
                name="descricao"
                value={livro.descricao}
                onChange={handleChange}
                placeholder="Descreva brevemente o conteúdo do livro..."
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleLimpar}
                  size="large"
                >
                  Limpar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                >
                  Cadastrar Livro
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Grid>

        {/* Coluna da Árvore de Categorias */}
        <Grid item xs={12} md={3}>
          <Paper elevation={1} sx={{ p: 2, backgroundColor: 'grey.50' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Categoria
              </Typography>
              <IconButton
                size="small"
                color="primary"
                onClick={handleMenuRaizClick}
                title="Opções de categoria"
              >
                <MoreVertIcon />
              </IconButton>
            </Box>

            {/* Menu do cabeçalho */}
            <Menu
              anchorEl={anchorElMenu}
              open={menuRaizOpen}
              onClose={handleMenuRaizClose}
            >
              <MenuItem onClick={handleAddCategoriaRaiz}>
                <ListItemIcon>
                  <AddIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Adicionar categoria</ListItemText>
              </MenuItem>
            </Menu>

            <Divider sx={{ mb: 2 }} />
            
            {categoriaSelecionada && (
              <Box sx={{ mb: 2, p: 1, backgroundColor: 'primary.main', borderRadius: 1 }}>
                <Typography variant="caption" color="white">
                  Selecionado:
                </Typography>
                <Typography variant="body2" fontWeight="bold" color="white">
                  {categoriaNome}
                </Typography>
              </Box>
            )}

            {adicionandoRaiz && (
              <Box sx={{ mb: 2, p: 1 }}>
                <TextField
                  inputRef={raizInputRef}
                  size="small"
                  fullWidth
                  placeholder="Nova categoria principal"
                  value={novaCategoriaRaiz}
                  onChange={(e) => setNovaCategoriaRaiz(e.target.value)}
                  onKeyDown={handleRaizKeyPress}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={adicionarCategoriaRaiz}
                          color="primary"
                          disabled={!novaCategoriaRaiz.trim()}
                        >
                          <CheckIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => {
                            setAdicionandoRaiz(false);
                            setNovaCategoriaRaiz('');
                          }}
                          color="error"
                        >
                          <CloseIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  helperText="Enter para adicionar, Esc para cancelar"
                />
              </Box>
            )}

            <List component="nav" sx={{ maxHeight: 500, overflow: 'auto' }}>
              {categorias.map((categoria) => (
                <CategoriaTreeItem
                  key={categoria.id}
                  categoria={categoria}
                  categoriaSelecionada={categoriaSelecionada}
                  onSelect={handleCategoriaSelect}
                  onAddSubcategory={handleAddSubcategory}
                  onDeleteCategory={handleDeleteCategory}
                  onRenameCategory={handleRenameCategory}
                  adicionandoEm={adicionandoEm}
                  renomeandoId={renomeandoId}
                  renderNovaSubcategoriaInput={renderNovaSubcategoriaInput}
                  renderRenomearInput={renderRenomearInput}
                />
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </form>
  </Paper>

  {/* Dialog de QR Code */}
      <Dialog
        open={dialogQRCode.open}
        onClose={() => setDialogQRCode({ open: false, livro: null, qrCodeUrl: '' })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <QrCode2Icon color="primary" />
          Livro cadastrado com sucesso!
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            O livro <strong>"{dialogQRCode.livro?.titulo}"</strong> foi cadastrado com sucesso.
            Deseja imprimir o QR Code para identificação?
          </DialogContentText>
          {dialogQRCode.qrCodeUrl && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, p: 2, backgroundColor: 'grey.100', borderRadius: 2 }}>
              <img 
                src={dialogQRCode.qrCodeUrl} 
                alt="QR Code do Livro" 
                style={{ maxWidth: '200px', border: '2px solid #333', padding: '10px', backgroundColor: 'white' }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setDialogQRCode({ open: false, livro: null, qrCodeUrl: '' });
              setMensagem('Livro cadastrado com sucesso!');
              setTipoMensagem('success');
              setOpenSnackbar(true);
            }}
          >
            Agora não
          </Button>
          <Button 
            onClick={imprimirQRCode} 
            variant="contained" 
            color="primary"
            startIcon={<QrCode2Icon />}
            autoFocus
          >
            Imprimir QR Code
          </Button>
        </DialogActions>
      </Dialog>

  {/* Dialog de Confirmação de Exclusão */}
  <Dialog
    open={dialogExcluir.open}
    onClose={() => setDialogExcluir({ open: false, id: '', nome: '' })}
  >
    <DialogTitle>Confirmar Exclusão</DialogTitle>
    <DialogContent>
      <DialogContentText>
        Tem certeza que deseja excluir a categoria <strong>"{dialogExcluir.nome}"</strong>?
        {' '}Todas as subcategorias também serão excluídas.
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={() => setDialogExcluir({ open: false, id: '', nome: '' })}>
        Cancelar
      </Button>
      <Button onClick={confirmarExclusao} color="error" variant="contained" autoFocus>
        Excluir
      </Button>
    </DialogActions>
  </Dialog>

  <Snackbar
    open={openSnackbar}
    autoHideDuration={4000}
    onClose={() => setOpenSnackbar(false)}
    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
  >
    <Alert
      onClose={() => setOpenSnackbar(false)}
      severity={tipoMensagem}
      sx={{ width: '100%' }}
    >
      {mensagem}
    </Alert>
  </Snackbar>
</Box>
);
}