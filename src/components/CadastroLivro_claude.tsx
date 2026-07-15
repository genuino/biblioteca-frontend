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
import CircularProgress from '@mui/material/CircularProgress';
import RefreshIcon from '@mui/icons-material/Refresh';

interface Autor {
  id?: number;
  nome: string;
  foto?: string;
  observacao?: string;
}

interface Livro {
  id?: number;
  titulo: string;
  autores: Autor[];
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

// CONFIGURAÇÃO DA API
const API_BASE_URL = 'http://localhost:8080/api';

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

  const [categorias, setCategorias] = React.useState<Categoria[]>([]);
  const [carregandoCategorias, setCarregandoCategorias] = React.useState(true);
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

  // ============================================
  // FUNÇÕES DA API DE CATEGORIAS
  // ============================================

  // Carregar categorias do backend
  const carregarCategorias = async () => {
    setCarregandoCategorias(true);
    try {
      const response = await fetch(`${API_BASE_URL}/categorias`);
      if (response.ok) {
        const data = await response.json();
        setCategorias(data);
      } else {
        throw new Error('Erro ao carregar categorias');
      }
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      setMensagem('Erro ao carregar categorias. Usando categorias padrão.');
      setTipoMensagem('error');
      setOpenSnackbar(true);
      // Fallback para categorias locais se necessário
    } finally {
      setCarregandoCategorias(false);
    }
  };

  // Carregar categorias ao montar o componente
  React.useEffect(() => {
    carregarCategorias();
  }, []);

  // Adicionar categoria raiz via API
  const adicionarCategoriaRaizAPI = async () => {
    if (!novaCategoriaRaiz.trim()) return;

    try {
      const response = await fetch(`${API_BASE_URL}/categorias`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: novaCategoriaRaiz.trim(),
          parentId: null, // null indica categoria raiz
        }),
      });

      if (response.ok) {
        const novaCategoria = await response.json();
        setCategorias([...categorias, novaCategoria]);
        setMensagem('Categoria adicionada com sucesso!');
        setTipoMensagem('success');
        setOpenSnackbar(true);
        setAdicionandoRaiz(false);
        setNovaCategoriaRaiz('');
      } else {
        throw new Error('Erro ao adicionar categoria');
      }
    } catch (error) {
      console.error('Erro ao adicionar categoria:', error);
      setMensagem('Erro ao adicionar categoria. Tente novamente.');
      setTipoMensagem('error');
      setOpenSnackbar(true);
    }
  };

  // Adicionar subcategoria via API
  const adicionarSubcategoriaAPI = async () => {
    if (!novaSubcategoria.trim() || !adicionandoEm) return;

    try {
      const response = await fetch(`${API_BASE_URL}/categorias`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: novaSubcategoria.trim(),
          parentId: adicionandoEm,
        }),
      });

      if (response.ok) {
        // Recarregar categorias para obter a estrutura atualizada
        await carregarCategorias();
        setMensagem('Subcategoria adicionada com sucesso!');
        setTipoMensagem('success');
        setOpenSnackbar(true);
        setAdicionandoEm(null);
        setNovaSubcategoria('');
      } else {
        throw new Error('Erro ao adicionar subcategoria');
      }
    } catch (error) {
      console.error('Erro ao adicionar subcategoria:', error);
      setMensagem('Erro ao adicionar subcategoria. Tente novamente.');
      setTipoMensagem('error');
      setOpenSnackbar(true);
    }
  };

  // Renomear categoria via API
  const renomearCategoriaAPI = async () => {
    if (!novoNome.trim() || !renomeandoId) return;

    try {
      const response = await fetch(`${API_BASE_URL}/categorias/${renomeandoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: novoNome.trim(),
        }),
      });

      if (response.ok) {
        await carregarCategorias();
        
        if (categoriaSelecionada === renomeandoId) {
          setCategoriaNome(novoNome.trim());
        }

        setMensagem('Categoria renomeada com sucesso!');
        setTipoMensagem('success');
        setOpenSnackbar(true);
        setRenomeandoId(null);
        setNovoNome('');
      } else {
        throw new Error('Erro ao renomear categoria');
      }
    } catch (error) {
      console.error('Erro ao renomear categoria:', error);
      setMensagem('Erro ao renomear categoria. Tente novamente.');
      setTipoMensagem('error');
      setOpenSnackbar(true);
    }
  };

  // Excluir categoria via API
  const excluirCategoriaAPI = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/categorias/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await carregarCategorias();
        
        if (categoriaSelecionada === id) {
          setCategoriaSelecionada('');
          setCategoriaNome('');
        }

        setMensagem('Categoria excluída com sucesso!');
        setTipoMensagem('success');
        setOpenSnackbar(true);
      } else {
        throw new Error('Erro ao excluir categoria');
      }
    } catch (error) {
      console.error('Erro ao excluir categoria:', error);
      setMensagem('Erro ao excluir categoria. Tente novamente.');
      setTipoMensagem('error');
      setOpenSnackbar(true);
    }
  };

  // ============================================
  // HANDLERS
  // ============================================

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

  const confirmarExclusao = async () => {
    const { id } = dialogExcluir;
    await excluirCategoriaAPI(id);
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      adicionarSubcategoriaAPI();
    } else if (e.key === 'Escape') {
      setAdicionandoEm(null);
      setNovaSubcategoria('');
    }
  };

  const handleRenameKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      renomearCategoriaAPI();
    } else if (e.key === 'Escape') {
      setRenomeandoId(null);
      setNovoNome('');
    }
  };

  const handleRaizKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      adicionarCategoriaRaizAPI();
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
      const response = await fetch(`${API_BASE_URL}/autores/buscar?nome=${encodeURIComponent(nome)}`);
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

  React.useEffect(() => {
    const timer = setTimeout(() => {
      buscarAutores(inputAutor);
    }, 300);

    return () => clearTimeout(timer);
  }, [inputAutor]);

  const criarNovoAutor = async (nomeAutor: string) => {
    if (!nomeAutor.trim()) return;

    try {
      const response = await fetch(`${API_BASE_URL}/autores`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome: nomeAutor.trim() }),
      });

      if (response.ok) {
        const novoAutor = await response.json();
        setInputAutor('');
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
    
      const response = await fetch(`${API_BASE_URL}/livros`, {
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
        id: livroForm.categoria
      },
      autores: livroForm.autores,
      valor: 0.0,
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
            <p><strong>Autor:</strong> ${dialogQRCode.livro.autores.map(a => a.nome).join(', ')}</p>
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
      <Box sx={{ pl: 2 + (nivel + 1) * 2, pr: 2, py