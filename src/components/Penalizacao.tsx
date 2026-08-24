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
import type { Livro, Aluno, Configuracao } from '../Objetos_Rest';
import { formatarDataInput } from '../Util';
import { NumericFormat, type NumberFormatValues } from 'react-number-format';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Collapse from '@mui/material/Collapse';

const NumericFormatFixed = NumericFormat as any;
// Adicione este estado dentro do componente:
  const [selectedDesc, setSelectedDesc] = React.useState<{ title: string; description: string } | null>(null);
  

// ─── Interfaces ───────────────────────────────────────────────────────────────

interface Penalizacao {
  idPagamento: number;
  valor: number;
  dataVencimento: string;
  dataPagamento: string;
  observacaoPagamento: string;
  idLivroVenda: number;
  idAluno: number;
  idFuncionario: number;
  pessoa: string;
  idEscola: number;
  idPenalizacao: number;
  dataInicial: string;
  dataFinal: string;
  observacaoPenalizacao: string;
  idLivro: number;
  livros: Livro[]
}

// ─── Dados locais de alunos (fallback / mock) ─────────────────────────────────

const alunosData: Aluno[] = [
  { id: 1, matricula: 'a1', nome: 'José Antônio da Silva' },
  { id: 2, matricula: 'b2', nome: 'Maria Aparecida Nogueira' },
  { id: 3, matricula: 'c3', nome: 'Antônia Leiva Dias' },
];

// ─── Fragmento da tabela ─────────────────────────────────────────────────────
function Row(props: { row: Penalizacao }) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  

  return (
    <React.Fragment>
      <TableRow sx={{ '& > .MuiTableCell-root': { borderBottom: 'unset' } }}>
        <TableCell>
          {row.livros && row.livros.length > 0 ? (
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          ) : null}
        </TableCell>
        <TableCell component="th" scope="row">
          {row.dataFinal}
        </TableCell>
        <TableCell align="right">
          <Typography variant="body2" color="text.secondary"
            sx={{
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
          }}>
            {row.observacaoPenalizacao ?? row.observacaoPagamento}
          </Typography>
          <Button
            size="small"
            onClick={() => setSelectedDesc({ title: row.idPenalizacao == null || row.idPenalizacao < 0 ? 'Pagamento/Multa' : 'Penalização', 
              description: row.observacaoPenalizacao ?? row.observacaoPagamento })}
            sx={{ mt: 0.5, p: 0, minWidth: 0, textTransform: 'none', fontSize: '0.75rem' }}
          >
            Leia mais
          </Button>
        </TableCell>
        <TableCell align="right">{row.dataVencimento}</TableCell>
        <TableCell align="right">{row.valor}</TableCell>
        <TableCell align="right">{row.pessoa}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                History
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell>Livro</TableCell>
                    <TableCell>Autor</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(row.livros ?? []).map((linhaLivro) => (
                    <TableRow key={linhaLivro.id}>
                      <TableCell component="th" scope="row">
                        {`${API_BASE_URL_IMAGEM}/${linhaLivro.imagens?.[0] ?? 'livro_avatar.svg'}`}
                      </TableCell>
                      <TableCell>{linhaLivro.titulo}</TableCell>
                      <TableCell align="right">{linhaLivro.autores[0].nome}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function BlogTableView() {

  // Filtros / seleção
  const [penalizacao, setPenalizacao] = useState<Penalizacao>({
    idPagamento: -1,
    valor: -1,
    dataVencimento: '',
    dataPagamento: '',
    observacaoPagamento: '',
    idLivroVenda: -1,
    idAluno: -1,
    idFuncionario: -1,
    idEscola: -1,
    idPenalizacao: -1,
    dataInicial: '',
    dataFinal: '',
    observacaoPenalizacao: '',
    idLivro: -1,
    livros: [] ,
    pessoa: ''
  });

  const [valorDiariaMultaDisplay, setValorDiariaMultaDisplay] = React.useState('');
  const [aluno, setAluno] = useState<Aluno | null>(alunosData[0]);
  const [pages, setPages] = useState(1000);
  const [idEscola, setIdEscola] = useState(-1);
  const [livros, setLivros] = useState<Livro[]>([]);

  // Configuração
  const [configuracaoObj, setConfiguracaoObj] = useState<Configuracao>();

  // Tabela REST
  const [penalizacoes, setPenalizacoes] = useState<Penalizacao[]>([]);
  
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
  useEffect(() => { carregarPenalizacoes(); }, []);

  // Recarrega a tabela sempre que o filtro (aluno ou livros) mudar
  useEffect(() => {
    
    if(!isMounted.current) {

      isMounted.current = true;
      return;
    }

    carregarPenalizacoesPorCampos(true);
  }, [aluno, livros]); // eslint-disable-line react-hooks/exhaustive-deps
  
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
  const carregarPenalizacoes = async () => {
    
    try {
      const response = await fetch(`${API_BASE_URL}/penalizacoes?paginas=${pages}&idEscola=${idEscola}`);
      if (response.ok) {
        const data = await response.json();
        setPenalizacoes(data);
      } else {
        throw new Error('Erro ao carregar empréstimos');
      }
    } catch (error) {
      console.error('Erro ao carregar empréstimos:', error);
    } finally {
      
    }
  };

  /** Carrega empréstimos filtrados por aluno e/ou livros selecionados */
  const carregarPenalizacoesPorCampos = async (pesquisarTodos: boolean) => {
    
    hasAluno.current = false;
    
    const idAlunoAux = (aluno?.id && pesquisarTodos) ?? -1;
    
    if(idAlunoAux == -1 && livros.length == 0) {

        return;
    }

    const ids: number[] = livros.map(l => l.id);
    
    try {
      const response = await axios.get(`${API_BASE_URL}/penalizacoes/por_campos`, {
        params: { idAluno: idAlunoAux, ids },
        paramsSerializer: (params) => {
          const idsPart = params.ids.map((id: number) => `ids=${id}`).join('&');
          return `idEscola=${idEscola}&${idsPart}&idAluno=${params.idAluno}`;
        },
      });
      setPenalizacoes(response.data);

    } catch (error) {
      console.error('Erro ao buscar empréstimos por campos:', error);
    } finally {
      
    }
  };

  const handleDataVencChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = formatarDataInput(e.target.value);

    setPenalizacao(prev => ({
        ...prev,
        dataVencimento: value
    }));
  };

  const handleDataIniChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = formatarDataInput(e.target.value);

    setPenalizacao(prev => ({
        ...prev,
        dataInicial: value
    }));
  };

  const handleDataFinalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = formatarDataInput(e.target.value);

    setPenalizacao(prev => ({
        ...prev,
        dataFinal: value
    }));
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
      await carregarPenalizacoes();

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
      await carregarPenalizacoes();

    } catch (error: any) {
      console.error('Erro na devolução:', error);
      setMensagem(error.message || 'Erro na devolução.');
      setTipoMensagem('error');
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
};

  
  const handleLimpar = () => {
    setLivros([]);
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
                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Descrição"
                    name="descricao"
                    value={penalizacao?.observacaoPenalizacao}
                    placeholder="Descreva a penalização..."
                />
            </Grid>

                            
            <Grid item xs={12} md={6}>
                <TextField
                fullWidth
                label="Data inicial"
                name="publicacao"
                value={penalizacao.dataInicial}
                onChange={handleDataIniChange}
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
                label="Data final"
                name="publicacao"
                value={penalizacao.dataFinal}
                onChange={handleDataFinalChange}
                placeholder="dd/MM/yyyy"
                inputProps={{ 
                    maxLength: 10
                }}
                helperText="Formato: dd/MM/yyyy"
                />
            </Grid>
            
            <Grid item xs={12}>
              
                <NumericFormatFixed
                    customInput={TextField} 
                    fullWidth
                    label="Valor para a multa"
                    name="valorDiariaMulta"
                    value={valorDiariaMultaDisplay}
                    prefix="R$ "
                    thousandSeparator="."
                    decimalSeparator=","
                    decimalScale={2}
                    fixedDecimalScale
                    allowNegative={false}
                    inputProps={{ maxLength: 16 }}
                    helperText="Formato: R$ 1.000,00"
                    onValueChange={(values: NumberFormatValues) => {
                        // values.formattedValue → "R$ 1.000,00"  (display)
                        // values.floatValue    → 1000             (número puro)
                        setValorDiariaMultaDisplay(values.formattedValue);
                        setPenalizacao(prev => ({
                            ...prev,
                            valor: values.floatValue ?? 0
                        }));
                    }}
                />

            </Grid>

            <Grid item xs={12} md={6}>
                <TextField
                fullWidth
                label="Data vencimento"
                name="publicacao"
                value={penalizacao?.dataVencimento}
                onChange={handleDataVencChange}
                placeholder="dd/MM/yyyy"
                inputProps={{ 
                    maxLength: 10
                }}
                helperText="Formato: dd/MM/yyyy"
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
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', width: 110 }}>Data penal</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Penalização</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', width: 160 }}>Data vencimento</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', width: 80 }}>Cobrança</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', width: 100 }}>Pessoa</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', width: 130 }}>Livro</TableCell>

                  {/* Célula do menu — só aparece se houver empréstimos */}
                  {hasAluno.current && (
                    <TableCell sx={{ color: 'white', fontWeight: 'bold', width: 50 }}>
                      <IconButton
                        onClick={(e) => setAnchorEl(e.currentTarget)}
                        sx={{ color: 'white' }}
                      >
                        <MoreVertIcon />
                      </IconButton>

                    </TableCell>
                  )}

                </TableRow>
              </TableHead>

              <TableBody>
                {(penalizacoes ?? []).map((row) => (
                  <Row key={row.idPenalizacao ?? row.idPagamento} row={row} />
                ))}
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