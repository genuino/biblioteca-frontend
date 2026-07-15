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
import { APP_TIPO_CONF, API_BASE_URL } from '../Constantes';
import type { Livro, Categoria, Autor } from '../Objetos_Rest';

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
  categoriaSelecionada: number; 
  onSelect: (id: number, name: string) => void;
  onAddSubcategory: (parentId: number) => void;
  onDeleteCategory: (id: number) => void;
  onRenameCategory: (id: number) => void;
  adicionandoEm: number | null;
  renomeandoId: number | null;
  renderNovaSubcategoriaInput: (parentId: number) => React.ReactNode;
  renderRenomearInput: (id: number, currentName: string) => React.ReactNode;
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
    onSelect(categoria.id, categoria.categoria);
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
    return renderRenomearInput(categoria.id, categoria.categoria);
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
          primary={categoria.categoria} 
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
    id: -1,
    titulo: '',
    autores: [],
    isbn: '',
    editora: '',
    edicao: '',
    categoria: null,
    publicacao: '',
    _publicacaoDisplay: '',
    copia: 0,
    localizacao: '',
    descricao: '',
    imagem: null,
  });

  const [categorias, setCategorias] = React.useState<Categoria[]>([]);
  const [carregandoCategorias, setCarregandoCategorias] = React.useState(true);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [mensagem, setMensagem] = React.useState('');
  const [tipoMensagem, setTipoMensagem] = React.useState<'success' | 'error'>('success');
  const [categoriaSelecionada, setCategoriaSelecionada] = React.useState<number>(-1);
  const [categoriaNome, setCategoriaNome] = React.useState<string>('');
  const [adicionandoEm, setAdicionandoEm] = React.useState<number | null>(null);
  const [renomeandoId, setRenomeandoId] = React.useState<number | null>(null);
  const [novaSubcategoria, setNovaSubcategoria] = React.useState<string>('');
  const [novoNome, setNovoNome] = React.useState<string>('');
  const [dialogExcluir, setDialogExcluir] = React.useState<{ open: boolean; id: number; nome: string }>({
    open: false,
    id: -1,
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
  const excluirCategoriaAPI = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/categorias/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await carregarCategorias();
        
        if (categoriaSelecionada === id) {
          setCategoriaSelecionada(0);
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
  // FORMATAÇÃO DE DATAS DE PUBLICAÇÃO
  // ============================================

  // Converte de yyyy-MM-dd (ISO) para dd/MM/yyyy (brasileiro)
  const formatarDataParaExibicao = (dataISO: string): string => {
    if (!dataISO) return '';
    const [ano, mes, dia] = dataISO.split('-');
    return `${dia}/${mes}/${ano}`;
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

    if (name === 'copia') {
      // aceita vazio (campo sendo apagado) ou só dígitos
      if (value === '' || /^\d+$/.test(value)) {
        setLivro(prev => ({
          ...prev,
          copia: value === '' ? 0 : Number(value),
        }));
      }
      return;
    }

    setLivro(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoriaSelect = (id: number, name: string) => {
    setCategoriaSelecionada(id);
    setCategoriaNome(name);
    setLivro(prev => ({
      ...prev,
      categoria: {
        id: id,
        categoria: name,
      },
    }));
  };

  const handleAddSubcategory = (parentId: number) => {
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

  const handleDeleteCategory = (id: number) => {
    const encontrarNome = (cats: Categoria[]): string => {
      for (const cat of cats) {
        if (cat.id === id) return cat.categoria;
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
    	
    setDialogExcluir({ open: false, id: -1, nome: '' });
  };

  const handleRenameCategory = (id: number) => {
    setRenomeandoId(id);
    setAdicionandoEm(null);
    
    const encontrarNome = (cats: Categoria[]): string => {
      for (const cat of cats) {
        if (cat.id === id) return cat.categoria;
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
          imagem: reader.result as string,
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
      imagem: null,
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

  // Debounce para não fazer muitas requisições
  React.useEffect(() => {
    const timer = setTimeout(() => {
      buscarAutores(inputAutor);
    }, 300);

    return () => clearTimeout(timer);
  }, [inputAutor]);

  const tratarAutor = async (nomeAutor: string, autoresAtuais: Autor[]): Promise<Autor[]> => {
    
    if (!nomeAutor.trim()) return autoresAtuais;
    
    const nome = nomeAutor.trim();
    
    //setInputAutor('');
    
    // Verificar se já está na lista
    const jaAdicionado = autoresAtuais.some(
        a => a.nome.toLowerCase() === nome.toLowerCase()
    );
    if (jaAdicionado) {

      return autoresAtuais;
    } 
    
    // Verificar se existe nos disponíveis
    const autorExiste = autoresDisponiveis.find(
        a => a.nome.toLowerCase() === nome.toLowerCase()
    );
    
    if (autorExiste) {
        return [...autoresAtuais, autorExiste];
    }
    
    const novoAutor = {
        id: -1,
        nome: nome,
    };

    setAutoresDisponiveis([...autoresDisponiveis, novoAutor]);
    
    return [...autoresAtuais, novoAutor];
    // Criar novo autor
    //return criarNovoAutor(nomeAutor, autoresAtuais);
    
  }

  /*const criarNovoAutor = async (nomeAutor: string, autoresAtuais: Autor[]): Promise<Autor[]> => {
    
    console.debug('Prestes a entrar no localhost:8081/biblioteca/autores');
    try {
      const response = await fetch(`${API_BASE_URL}/autores`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome: nomeAutor.trim() }),
    });
    console.debug('Passou pelo localhost:8081/biblioteca/autores');

    if (response.ok) {
      const novoAutor = await response.json();
      
      setAutoresDisponiveis(prev => [...prev, novoAutor]);
      // Adicionar ao livro
      /*setLivro(prev => ({
        ...prev,
        autores: [...prev.autores, novoAutor]
      }));*/

      /*setMensagem('Autor criado e adicionado com sucesso!');
      setTipoMensagem('success');
      setOpenSnackbar(true);
      
    } else {

      throw new Error('Erro ao criar autor');
      return autoresAtuais;
    }
    } catch (error) {
      console.error('Erro ao criar autor:', error);
      setMensagem('Erro ao criar autor. Tente novamente.');
      setTipoMensagem('error');
      setOpenSnackbar(true);
       return autoresAtuais;
    }
  };*/
  
  const handleAdicionarAutor = async () => {

    const novosAutores = await tratarAutor(inputAutor, livro.autores);
    setLivro(prev => ({ 
        ...prev, 
        autores: novosAutores 
    }));
    setInputAutor('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!livro.titulo || !livro.isbn || (!livro.autores && !inputAutor)) {
      setMensagem('Por favor, preencha os campos obrigatórios!');
      setTipoMensagem('error');
      setOpenSnackbar(true);
      return;
    }

    try {

      const autoresFinais = await tratarAutor(inputAutor, livro.autores);

      const livroFormatado = {
        ...formatarLivroParaBackend(livro),
        autores: autoresFinais // Usa a lista retornada, não o estado
      };

      //alert(livroFormatado.id);

      // Chamada ao backend
      const response = await fetch(`${API_BASE_URL}/livro?comRestricao=true`, {  // Ajuste a porta
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(livroFormatado),
      });

    if (!response.ok) {
      // Tenta ler como JSON, se falhar, lê como texto
      let errorMessage = 'Erro ao cadastrar livro';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        const errorText = await response.text();
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    // Tenta ler a resposta - pode ser JSON ou texto
    let data: any = {};
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      // Resposta é JSON
      data = await response.json();
    } else {
      // Resposta é texto puro
      const textoResposta = await response.text();
      console.log('Resposta do backend (texto):', textoResposta);
      
      // Cria um objeto com os dados básicos
      data = {
        id: null,
        titulo: livro.titulo,
        qrCodeUrl: '', // QR Code não disponível
        message: textoResposta
      };
    }
    // Esperado: { id: 1, titulo: '...', qrCodeUrl: 'https://...' }
    
    console.log('Livro cadastrado:', data);
    
    // Verifica se há QR Code disponível
    if (data.qrCodeUrl) {

      console.log('=== DEBUG RESPOSTA ===');
      console.log('Resposta JSON:', data);
      console.log('QR Code URL:', data.qrCodeUrl);

      // Abrir dialog com QR Code
      setDialogQRCode({ 
        open: true, 
        livro: { ...livro },
        qrCodeUrl: data.qrCodeUrl 
      });
    } else {
      // Mostrar mensagem de sucesso direta
      setMensagem(data.message || 'Livro cadastrado com sucesso!');
      setTipoMensagem('success');
      setOpenSnackbar(true);
    }
    
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
      id: -1,
      titulo: '',
      autores: [],
      isbn: '',
      editora: '',
      edicao: '',
      categoria: null,
      publicacao: '',
      _publicacaoDisplay: '',
      copia: 0,
      localizacao: '',
      descricao: '',
      imagem: null,
    });
    setCategoriaSelecionada(-1);
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
      categoria: {
        id: livroForm.categoria?.id  // Assumindo que categoria é o ID do gênero
      },
      autores: livroForm.autores.map(autor => ({
        id: autor.id || null,
        nome: autor.nome,
        foto: autor.foto || null,
        observacao: autor.observacao || null
    })),
      valor: 0.0,  // Você pode adicionar campo de valor no formulário
      copia: livroForm.copia || 1,
      imagem: livroForm.imagem
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

  const renderNovaSubcategoriaInput = (parentId: number) => {
    const encontrarNivel = (cats: Categoria[], id: number, nivelAtual = 0): number => {
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
                  onClick={adicionarSubcategoriaAPI}
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

  const renderRenomearInput = (id: number, currentName: string) => {
    const encontrarNivel = (cats: Categoria[], searchId: number, nivelAtual = 0): number => {
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
                  onClick={renomearCategoriaAPI}
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

  const handleDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não é dígito
    
    // Aplica a máscara dd/MM/yyyy
    if (value.length <= 2) {
      value = value;
    } else if (value.length <= 4) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    } else if (value.length <= 8) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4) + '/' + value.slice(4);
    } else {
      value = value.slice(0, 2) + '/' + value.slice(2, 4) + '/' + value.slice(4, 8);
    }
    
    // Converte para formato ISO antes de salvar no estado
    let dataISO = '';
    if (value.length === 10) {
      const [dia, mes, ano] = value.split('/');
      dataISO = `${ano}-${mes}-${dia}`;
    }
    
    setLivro(prev => ({
      ...prev,
      publicacao: dataISO,
      _publicacaoDisplay: value, // Campo auxiliar para exibição
    }));
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
                
                {livro.imagem ? (
                  <Box sx={{ position: 'relative' }}>
                    <Card elevation={2}>
                      <CardMedia
                        component="img"
                        image={livro.imagem}
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

                {!livro.imagem && (
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
                            //setLivro(prev => ({ ...prev, autores: novosAutores }));
                        }}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter' && inputAutor.trim()) {
                                
                                event.preventDefault();
                                event.stopPropagation();
                                setProcessandoEnter(true);

                                console.debug("Entrou aqui event.key === 'Enter'");
                                handleAdicionarAutor();
                                
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
                label="Data de Publicação"
                name="publicacao"
                value={livro._publicacaoDisplay || (livro.publicacao ? formatarDataParaExibicao(livro.publicacao) : '')}
                onChange={handleDataChange}
                placeholder="dd/MM/yyyy"
                inputProps={{ 
                  maxLength: 10
                }}
                helperText="Formato: dd/MM/yyyy"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Quantidade"
                name="copia"
                type="number"
                value={livro.copia === 0 ? '' : livro.copia}
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
                          onClick={adicionarCategoriaRaizAPI}
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
    onClose={() => setDialogExcluir({ open: false, id: -1, nome: '' })}
  >
    <DialogTitle>Confirmar Exclusão</DialogTitle>
    <DialogContent>
      <DialogContentText>
        Tem certeza que deseja excluir a categoria <strong>"{dialogExcluir.nome}"</strong>?
        {' '}Todas as subcategorias também serão excluídas.
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={() => setDialogExcluir({ open: false, id: -1, nome: '' })}>
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