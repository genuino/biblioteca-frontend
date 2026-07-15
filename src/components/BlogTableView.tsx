import * as React from 'react';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import axios from 'axios';
import { APP_TIPO_CONF, API_BASE_URL, API_BASE_URL_IMAGEM } from '../Constantes';
import { format, addDays } from 'date-fns';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { useRef } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import type { Aluno, Livro, Configuracao } from '../Objetos_Rest';

// ─── Interfaces ───────────────────────────────────────────────────────────────

interface Emprestimo {
  id?: number;
  copia: number;
  data: string;
  dataEntrega: string;
  livros: Livro[];
  idAluno: number;
  emprestimo: boolean;
}

// ─── Dados locais de alunos (fallback / mock) ─────────────────────────────────

const alunosData: Aluno[] = [
  { id: 1, matricula: 'a1', nome: 'José Antônio da Silva' },
  { id: 2, matricula: 'b2', nome: 'Maria Aparecida Nogueira' },
  { id: 3, matricula: 'c3', nome: 'Antônia Leiva Dias' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const chipColor = (categoria?: string): 'primary' | 'success' | 'secondary' | 'default' => {
  if (!categoria) return 'default';
  if (categoria.toLowerCase().includes('ciência') || categoria.toLowerCase().includes('exatas')) return 'primary';
  if (categoria.toLowerCase().includes('humanas') || categoria.toLowerCase().includes('história')) return 'success';
  if (categoria.toLowerCase().includes('arte') || categoria.toLowerCase().includes('design')) return 'secondary';
  return 'default';
};

// ─── Componente principal ─────────────────────────────────────────────────────

export default function BlogTableView() {

  // Filtros / seleção
  const [aluno, setAluno] = useState<Aluno | null>(alunosData[0]);
  const [livros, setLivros] = useState<Livro[]>([]);
  const [livrosDisponiveis, setLivrosDisponiveis] = useState<Livro[]>([]);
  const [inputLivro, setInputLivro] = useState('');
  const [buscandoLivro, setBuscandoLivro] = useState(false);
  const [pages, setPages] = useState(1000);
  // Adicione este estado dentro do componente:
  const [selectedDesc, setSelectedDesc] = React.useState<{ title: string; description: string } | null>(null);

  // Configuração
  const [configuracaoObj, setConfiguracaoObj] = useState<Configuracao>();

  // Tabela REST
  const [emprestimos, setEmprestimos] = useState<Emprestimo[]>([]);
  
  // UI
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [tipoMensagem, setTipoMensagem] = useState<'success' | 'error'>('success');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
  
  const isMounted = useRef(false);
  const hasAluno = useRef(false);

  // ── Efeitos ─────────────────────────────────────────────────────────────────

  useEffect(() => { carregarConfiguracao(); }, []);
  useEffect(() => { carregarEmprestimos(); }, []);

  // Recarrega a tabela sempre que o filtro (aluno ou livros) mudar
  useEffect(() => {
    
    if(!isMounted.current) {

      isMounted.current = true;
      return;
    }

    carregarEmprestimosPorCampos(true);
  }, [aluno]); // eslint-disable-line react-hooks/exhaustive-deps

  // Recarrega a tabela sempre que o filtro (aluno ou livros) mudar
  useEffect(() => {
    
    carregarEmprestimosPorCampos(false);
  }, [livros]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── REST calls ───────────────────────────────────────────────────────────────
  const carregarConfiguracao = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/configuracao/pesquisar_conf?tipoConfiguracao=${APP_TIPO_CONF}`
      );
      if (response.ok) {
        const data = await response.json();
        setConfiguracaoObj(data);
      }
    } catch (error) {
      console.error('Erro ao carregar configuração:', error);
    }
  };

  /** Carrega todos os empréstimos (sem filtro) */
  const carregarEmprestimos = async () => {
    
    try {
      const response = await fetch(`${API_BASE_URL}/venda?paginas=${pages}`);
      if (response.ok) {
        const data = await response.json();
        setEmprestimos(data);
      } else {
        throw new Error('Erro ao carregar empréstimos');
      }
    } catch (error) {
      console.error('Erro ao carregar empréstimos:', error);
    } finally {
      
    }
  };

  /** Carrega empréstimos filtrados por aluno e/ou livros selecionados */
  const carregarEmprestimosPorCampos = async (pesquisarTodos: boolean) => {
    
    hasAluno.current = false;
    
    const idAlunoAux = (aluno?.id && pesquisarTodos) ?? -1;
    
    if(idAlunoAux == -1 && livros.length == 0) {

        return;
    }

    const ids: number[] = livros.map(l => l.id);
    
    try {
      const response = await axios.get(`${API_BASE_URL}/venda`, {
        params: { idAluno: idAlunoAux, ids },
        paramsSerializer: (params) => {
          const idsPart = params.ids.map((id: number) => `ids=${id}`).join('&');
          return `paginas=${pages}&${idsPart}&idAluno=${params.idAluno}`;
        },
      });
      setEmprestimos(response.data);

      // Valida limite de reservas por aluno
      const qtasEmprestimosAux = configuracaoObj?.qtosEmprestimo ?? 0;
      const reservasFiltradas = (response.data as Emprestimo[]).filter(
        r => r.idAluno === idAlunoAux
      );
      if (qtasEmprestimosAux > 0 && reservasFiltradas.length >= qtasEmprestimosAux) {
        setMensagem('Aluno já atingiu o limite de empréstimos.');
        setTipoMensagem('error');
        setOpenSnackbar(true);
        setLoading(true);
      }

      //Constrói o menu com devolver tudo e renovar tudo
      if(idAlunoAux != -1 && emprestimos.length > 0) {

        hasAluno.current = false;
      }

    } catch (error) {
      console.error('Erro ao buscar empréstimos por campos:', error);
    } finally {
      
    }
  };

  // ── Submit ───────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!aluno?.id || livros.length === 0) {
      setMensagem('Por favor, preencha os campos obrigatórios!');
      setTipoMensagem('error');
      setOpenSnackbar(true);
      return;
    }

    setLoading(true);
    try {
      const data: Date = new Date();
      //const dataEntrega: Date = addDays(data, configuracaoObj?.diariaEmprestimo ?? 3);

      const payload = {
        copia: 1,
        data: format(data, 'yyyy-MM-dd'),
        dataEntrega: null,
        livros,
        idAluno: aluno.id,
        emprestimo: true,
      };

      const response = await fetch(`${API_BASE_URL}/venda`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      // ✅ Lê o body UMA única vez
      const responseText = await response.text();
      setTipoMensagem('success');
      
      if (!response.ok) {

        setTipoMensagem('error');

        //alert('Erro: ' + responseText);

        // tenta extrair mensagem do JSON, senão usa o texto direto
        try {
          const errorData = JSON.parse(responseText);
          throw new Error(errorData.message || 'Erro ao cadastrar empréstimo');
        } catch {
          throw new Error(responseText || 'Erro ao cadastrar empréstimo');
        }
      }

      // sucesso — Spring Boot retorna String simples
      setMensagem(responseText);
      setOpenSnackbar(true);
      handleLimpar();
      await carregarEmprestimos();

    } catch (error: any) {
      console.error('Erro ao cadastrar empréstimo:', error);
      setMensagem(error.message || 'Erro ao cadastrar empréstimo. Tente novamente.');
      setTipoMensagem('error');
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
};

  // ── Devolver livro ───────────────────────────────────────────────────────────────────
  const devolverLivro = async (emprestimoId: number) =>  {
    
    setLoading(true);
    try {
      
      //const dataEntrega: Date = addDays(data, configuracaoObj?.diariaEmprestimo ?? 3);

      const response = await fetch(`${API_BASE_URL}/venda/` + emprestimoId, {
          method: 'PATCH',
          headers: {
              'Content-Type': 'application/json'
          },
      });
      
      // ✅ Lê o body UMA única vez
      const responseText = await response.text();
      setTipoMensagem('success');
      
      if (!response.ok) {

        setTipoMensagem('error');

        //alert('Erro: ' + responseText);

        // tenta extrair mensagem do JSON, senão usa o texto direto
        try {
          const errorData = JSON.parse(responseText);
          throw new Error(errorData.message || 'Erro na devolução');
        } catch {
          throw new Error(responseText || 'Erro na devolução');
        }
      }

      // sucesso — Spring Boot retorna String simples
      setMensagem(responseText);
      setOpenSnackbar(true);
      handleLimpar();
      await carregarEmprestimos();

    } catch (error: any) {
      console.error('Erro na devolução:', error);
      setMensagem(error.message || 'Erro na devolução.');
      setTipoMensagem('error');
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
};

  /*const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!aluno?.id || livros.length === 0) {
      setMensagem('Por favor, preencha os campos obrigatórios!');
      setTipoMensagem('error');
      setOpenSnackbar(true);
      return;
    }

    setLoading(true);
    try {

      const data: Date = new Date();
      const dataEntrega: Date = addDays(data, configuracaoObj?.diariaEmprestimo ?? 3);

      const payload = {
        copia: 1,
        data: format(data, 'yyyy-MM-dd'),           
        dataEntrega: format(dataEntrega, 'yyyy-MM-dd'),
        livros,
        matricula: aluno.id,
        emprestimo: true,
      };

      const response = await fetch(`${API_BASE_URL}/venda`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errorMessage = 'Erro ao cadastrar empréstimo';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        await response.json();
      } else {
        const txt = await response.text();
        setMensagem(txt);
        setTipoMensagem('success');
        setOpenSnackbar(true);
      }

      handleLimpar();
      await carregarEmprestimos(); // Recarrega a tabela após salvar

    } catch (error: any) {
      console.error('Erro ao cadastrar empréstimo:', error);
      setMensagem(error.message || 'Erro ao cadastrar empréstimo. Tente novamente.');
      setTipoMensagem('error');
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };*/

  const handleLimpar = () => {
    setLivros([]);
  };

  // Métodos do menu da tabela
  const devolverTudo = async () => {
    
    const ids = emprestimos.map(e => e.id);
    await axios.patch(`${API_BASE_URL}/venda/devolver-tudo`, { ids });
    carregarEmprestimosPorCampos(true);
  
  };

  const renovarTudo = async () => {
    
    const ids = emprestimos.map(e => e.id);
    await axios.patch(`${API_BASE_URL}/venda/renovar-tudo`, { ids });
    carregarEmprestimosPorCampos(true);
    
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>

      {/* ── Formulário ── */}
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom color="primary" sx={{ mb: 3 }}>
          📚 Empréstimo de Livros
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>

            {/* Autocomplete – Aluno */}
            <Grid item xs={12} md={6}>
              <Autocomplete
                disablePortal
                value={aluno}
                onChange={(_event, newValue) => setAluno(newValue)}
                options={alunosData}
                getOptionLabel={(option) => option.nome}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                fullWidth
                renderInput={(params) => (
                  <TextField {...params} label="Aluno *" placeholder="Selecione o aluno" />
                )}
              />
            </Grid>

            {/* Autocomplete – Livros */}
            <Grid item xs={12} md={6}>
              <Autocomplete
                multiple
                freeSolo
                options={livrosDisponiveis}
                getOptionLabel={(option) =>
                  typeof option === 'string' ? option : option.titulo
                }
                value={livros}
                inputValue={inputLivro}
                onInputChange={async (_event, newInputValue) => {
                  setInputLivro(newInputValue);
                  if (!newInputValue.trim()) return;
                  setBuscandoLivro(true);
                  try {
                    const response = await axios.get(
                      `${API_BASE_URL}/livro/pesquisar_livro?livro=${newInputValue}`
                    );
                    setLivrosDisponiveis(response.data);
                  } catch (error) {
                    console.error('Erro ao buscar livros:', error);
                  } finally {
                    setBuscandoLivro(false);
                  }
                }}
                onChange={(_event, newValue) => {
                  const selecionados = (newValue as any[]).filter(
                    (v) => typeof v !== 'string'
                  ) as Livro[];
                  setLivros(selecionados);
                }}
                loading={buscandoLivro}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      label={option.titulo}
                      {...getTagProps({ index })}
                      color="primary"
                      variant="outlined"
                      key={index}
                    />
                  ))
                }
                renderOption={(props, option) => (
                  <li {...props} key={option.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar
                        src={`${API_BASE_URL_IMAGEM}/${option.imagem}`}
                        alt={option.titulo}
                        variant="rounded"
                        sx={{ width: 36, height: 50 }}
                      />
                      <Box>
                        <Typography variant="body2">{option.titulo}</Typography>
                        {option.editora && (
                          <Typography variant="caption" color="text.secondary">
                            {option.editora}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </li>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Livros *"
                    placeholder="Digite o título ou autor"
                    helperText="Digite para pesquisar e selecione o livro"
                  />
                )}
              />
            </Grid>

            {/* Botões */}
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
                  disabled={loading}
                >
                  {loading ? 'Salvando…' : 'Salvar empréstimo'}
                </Button>
                
              </Box>
            </Grid>

          </Grid>
        </form>
      </Paper>

      {/* ── Tabela de empréstimos (carregada via REST) ── */}
      <Paper elevation={2} sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h5" color="primary">
            📋 Empréstimos Registrados
          </Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="tabela de empréstimos">
              <TableHead>
                <TableRow sx={{ backgroundColor: 'primary.main' }}>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', width: 110 }}>Capa</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', width: 130 }}>Categoria</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', width: 130 }}>Título</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Descrição</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', width: 160 }}>Autores</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', width: 80 }}>Cópias</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', width: 100 }}>Aluno</TableCell>


                  {/* Célula do menu — só aparece se houver empréstimos */}
                  {hasAluno.current && (
                    <TableCell sx={{ color: 'white', fontWeight: 'bold', width: 50 }}>
                      <IconButton
                        onClick={(e) => setAnchorEl(e.currentTarget)}
                        sx={{ color: 'white' }}
                      >
                        <MoreVertIcon />
                      </IconButton>

                      <Menu
                        anchorEl={anchorEl}
                        open={openMenu}
                        onClose={() => setAnchorEl(null)}
                      >
                        <MenuItem onClick={() => { devolverTudo(); setAnchorEl(null); }}>
                          Devolver tudo
                        </MenuItem>
                        <MenuItem onClick={() => { renovarTudo(); setAnchorEl(null); }}>
                          Renovar tudo
                        </MenuItem>
                      </Menu>
                    </TableCell>
                  )}

                </TableRow>
              </TableHead>

              <TableBody>
                {emprestimos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                      <Typography variant="body2" color="text.secondary">
                        Nenhum empréstimo encontrado.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  emprestimos.flatMap((emprestimo, empIdx) =>
                    emprestimo.livros.map((livro, livroIdx) => (
                      <TableRow
                        key={`${empIdx}-${livroIdx}`}
                        sx={{
                          '&:nth-of-type(odd)': { backgroundColor: 'action.hover' },
                          '&:hover': { backgroundColor: 'action.selected' },
                        }}
                      >
                        {/* Capa */}
                        <TableCell>
                          <Avatar
                            src={`${API_BASE_URL_IMAGEM}/${livro.imagem}`}
                            alt={livro.titulo}
                            variant="rounded"
                            sx={{ width: 48, height: 64 }}
                          >
                            {livro.titulo.charAt(0)}
                          </Avatar>
                        </TableCell>

                        {/* Categoria */}
                        <TableCell>
                          <Chip
                            label={livro.categoria?.caminhoCategoria ?? '—'}
                            size="small"
                            color={chipColor(livro.categoria?.caminhoCategoria)}
                          />
                        </TableCell>

                        {/* Título */}
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {livro.titulo}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {livro.editora}{livro.edicao ? ` · ${livro.edicao}ª ed.` : ''}
                          </Typography>
                        </TableCell>

                        {/* Descrição */}
                        <TableCell>
                          <Typography variant="body2" color="text.secondary"
                            sx={{
                              overflow: 'hidden',
                              display: '-webkit-box',
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: 'vertical',
                            }}>
                            {livro.descricao}
                          </Typography>
                          <Button
                            size="small"
                            onClick={() => setSelectedDesc({ title: livro.titulo, description: livro.descricao })}
                            sx={{ mt: 0.5, p: 0, minWidth: 0, textTransform: 'none', fontSize: '0.75rem' }}
                          >
                            Leia mais
                          </Button>
                        </TableCell>

                        {/* Autores */}
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AvatarGroup max={2}>
                              {livro.autores.map((autor, aIdx) => (
                                <Avatar key={aIdx} alt={autor.nome} sx={{ width: 28, height: 28 }}>
                                  {autor.nome.charAt(0)}
                                </Avatar>
                              ))}
                            </AvatarGroup>
                            <Typography variant="caption" sx={{ display: { xs: 'none', md: 'block' } }}>
                               {livro.autores.length > 1
                                ? `${livro.autores.length} autores`
                                : livro.autores[0]?.nome ?? '—'}
                            </Typography>
                          </Box>
                        </TableCell>

                        {/* Cópias */}
                        <TableCell>
                          <Typography variant="body2" align="center">
                            {livro.copia}
                          </Typography>
                        </TableCell>

                        {/* Aluno (matrícula) */}
                        <TableCell>
                          <Chip
                            label={alunosData.find(a => a.id.toString ?? -1 === emprestimo.idAluno)?.nome ?? emprestimo.idAluno}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        
                        {/* Aluno (matrícula) */}
                        <TableCell>
                          <Button
                            variant="outlined"
                            onClick={() => devolverLivro(emprestimo.id ?? -1)}
                            size="small"
                            disabled={loading}
                            sx={{ backgroundColor: '#E65100', 
                              color: 'white',
                              '&:hover': { backgroundColor: '#BF360C' } }}
                          >
                            {loading ? 'Devolvendo…' : 'Devolver'}
                          </Button>      
                        </TableCell>

                      </TableRow>
                    ))
                  )
                )}
              </TableBody>
            </Table>
          </TableContainer>
        
      </Paper>

      <Dialog
        open={!!selectedDesc}
        onClose={() => setSelectedDesc(null)}
        maxWidth="sm"
        fullWidth
      >
      <DialogTitle>{selectedDesc?.title}</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1">{selectedDesc?.description}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedDesc(null)}>Fechar</Button>
        </DialogActions>
      </Dialog>

      {/* ── Feedback ── */}
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