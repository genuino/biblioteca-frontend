import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import { API_BASE_URL, API_BASE_URL_IMAGEM, APP_TIPO_CONF_RESERVA } from '../Constantes';
import Button from '@mui/material/Button';
import { eBissexto, aplicarMascara } from '../utils/Util';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import type { Livro, Configuracao} from '../Objetos_Rest';

const alunosData = [
  {
    id: 1,
    matricula: 'a1',
    nome: 'José Antônio da Silva',
  },
  {
    id: 2,
    matricula: 'b2',
    nome: 'Maria Aparecida Nogueira',
  },
  {
    id: 3,
    matricula: 'c3',
    nome: 'Antônia Leiva Dias',
  },
];

interface Reserva {
  inputValue?: string;
  id?: number;
  copia: number;
  dataInicial: string;
  dataFinal: string;
  livros: Livro[];
  idAluno: number;
}

export default function Reserva() {

    /*const [livroTable, setLivroTable] = React.useState<LivroTable>({
        id: -1,
        titulo: '',
        editora: '',
        edicao: '',
        imagem: '',
        descricao: '',
        categoria: null,
        msg: '',
        copia: 0,
        autores: [] 
    });*/
    
    const [livros, setLivros] = useState<Livro[]>([]);
    const [livrosDisponiveis, setLivrosDisponiveis] = useState<Livro[]>([]);
    const [inputLivro, setInputLivro] = React.useState('');
    const [buscandoLivro, setBuscandoLivro] = React.useState(false);
    const [configuracaoObj, setConfiguracaoObj] = useState<Configuracao>();    
    const [paginacaoReserva, setPaginacaoReserva] = React.useState(1000);
    const [reservas, setReservas] = React.useState<Reserva[]>([]);
    const [dataInicial, setDataInicial] = React.useState('');
    const [dataFinal, setDataFinal] = React.useState('');
    const [dataInicialDisplay, setDataInicialDisplay] = React.useState('');
    const [dataFinalDisplay, setDataFinalDisplay] = React.useState('');
    const [aluno, setAluno] = React.useState<{ id: number; matricula: string, nome: string; } | null>(alunosData[0]);
    const [mensagem, setMensagem] = React.useState('');
    const [tipoMensagem, setTipoMensagem] = React.useState<'success' | 'error'>('success');
    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    // Carregar categorias ao montar o componente												 
    React.useEffect(() => {
        carregarConfiguracao();
    }, []);    
    
    // Carregar reservas ao montar o componente												 
    React.useEffect(() => {
        
        carregarReserva();
    }, []);    
    
    // Carregar reservas ao montar o componente												 
    React.useEffect(() => {
        
        carregarReservaPorCampos();
    }, [livros, aluno]);    
    
    // Carregar categorias do backend
    const carregarConfiguracao = async () => {
        
        try {
            const response = await fetch(`${API_BASE_URL}/configuracao/pesquisar_conf?tipoConfiguracao=${APP_TIPO_CONF_RESERVA}`);
            if (response.ok) {
                const data = await response.json();
                setConfiguracaoObj(data);
            } else {
                throw new Error('Erro ao carregar configuracao');
            }
        } catch (error) {
            console.error('Erro ao carregar configuracao:', error);
            //setMensagem('Erro ao carregar categorias. Usando categorias padrão.');
            //setTipoMensagem('error');
            
        // Fallback para categorias locais se necessário
        } finally {
            
        }
  };

    // Carregar categorias do backend
    const carregarReservaPorCampos = async () => {
        
        setLoading(false);
        let idAlunoAux = -1;

        if(aluno && aluno.matricula) {

            idAlunoAux = aluno.id;
        }

        const ids: number[] = livros.map(livro => livro.id);
        const nomes: number[] = [idAlunoAux];

        try {
            const response = await axios.get(`${API_BASE_URL}/reserva/buscar_reservas_nomes`, {
                params: { nomes, ids },
                paramsSerializer: (params) => {
                    const nomesPart = params.nomes.map((nome: string) => `nomes=${nome}`).join('&');
                    const idsPart = params.ids.map((id: number) => `ids=${id}`).join('&');
                    return `${idsPart}&${nomesPart}`;
                }
            });
            
            setReservas(response.data); 

            let qtasReservasAux = (configuracaoObj?.qtasReservas ?? 0);
            const reservasFiltradas = reservas.filter(r => r.idAluno === idAlunoAux);
            if(qtasReservasAux > 0 
                && reservasFiltradas.length >= qtasReservasAux ) {

                try {
                    setMensagem('Aluno já possui os limites de reservas.');
                    setTipoMensagem('error');
                    setLoading(true);
    
                } finally {
                    setLoading(false); // garante que desabilita mesmo se der erro
                }
            }

        } catch (error) {
            console.error('Erro ao carregar reserva:', error);
            //setMensagem('Erro ao carregar categorias. Usando categorias padrão.');
            //setTipoMensagem('error');
            
        // Fallback para categorias locais se necessário
        } finally {
            
        }
    };

    // Carregar categorias do backend
    const carregarReserva = async () => {
        
        try {
            const response = await fetch(`${API_BASE_URL}/reserva/pesquisar_reserva/${paginacaoReserva}`);
            if (response.ok) {
                const data = await response.json();
                setReservas(data);
            } else {
                throw new Error('Erro ao carregar reservas');
            }
        } catch (error) {
            console.error('Erro ao carregar reserva:', error);
            //setMensagem('Erro ao carregar categorias. Usando categorias padrão.');
            //setTipoMensagem('error');
            
        // Fallback para categorias locais se necessário
        } finally {
            
        }
    };

    /*const handleAdicionarLivro = async () => {
              
        if(livros && configuracaoObj && livros.length >= configuracaoObj?.qtasReservas) {
            
          setMensagem('Numero de '+ configuracaoObj?.qtasReservas + 
            'reservas permitidas alcançadas. \nNecessário cancelar uma ou mais reservas');
          setTipoMensagem('error');
          setOpenSnackbar(true);
          return;
        }

        const nome = inputLivro.trim();

        if (nome) {   
        
            // Verificar se já está na lista
            const jaAdicionado = livros.some(
                a => a.titulo.toLowerCase() === nome.toLowerCase()
            );
            if (!jaAdicionado) {

                // Verificar se existe nos disponíveis
               const livroExiste = livrosDisponiveis.find(
                    a => a.titulo.toLowerCase() === nome.toLowerCase()
                );
        
                if (livroExiste) {
                    setLivros([...livros, livroExiste]);
                }
            }
        }

        setInputLivro('');
    };*/

    // Converte de yyyy-MM-dd (ISO) para dd/MM/yyyy (brasileiro)
    const formatarDataParaExibicao = (dataISO: string): string => {
        if (!dataISO) return '';
        const [ano, mes, dia] = dataISO.split('-');
        return `${dia}/${mes}/${ano}`;
  };


    const handleDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, 
        tipo: 'inicial' | 'final'
    ) => {
        
        let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não é dígito
        
        value = aplicarMascara(value);

        // Converte para formato ISO antes de salvar no estado
        let dataISO = '';
        if (value.length === 10) {
          const [dia, mes, ano] = value.split('/');
          dataISO = `${ano}-${mes}-${dia}`;
        }
        
        if (tipo === 'inicial') {
            
            setDataInicial(dataISO);
            setDataInicialDisplay(value);

        } else {
        
            setDataFinal(dataISO);
            setDataFinalDisplay(value);
        }
        
    };

    const addDiasReservasDtFinal = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => {
            
        // Adiciona 3 dias na data final
        let dataFinalDisplay = dataInicialDisplay;
        let qtasReservasAux = (configuracaoObj?.qtasReservas ?? 0);
        
        if (dataInicial && qtasReservasAux > 0 && dataInicial.length >= 8) {

            let [dia, mes, ano] = dataFinalDisplay.split('/');
            
            let diaAux = parseInt(dia.trim());
            diaAux += qtasReservasAux;
            let mesAux = parseInt(mes.trim());
            let ultimoDiaMes = 31;

            if(mes == '02') {
                
                ultimoDiaMes = (eBissexto(parseInt(ano.trim())) ? 28 : 29);
            }   
            else if(mes =='03' || mes =='05' || mes =='07'
                || mes =='08'|| mes =='10'|| mes =='12') {
                
                ultimoDiaMes = 31;    
            } else if(mes =='04' || mes =='06' || mes =='09'
                || mes =='11') {

                ultimoDiaMes = 30;
            }

            while(diaAux > ultimoDiaMes) {

                diaAux = diaAux - ultimoDiaMes;
                if(mesAux == 12) {
                        
                        mesAux = 1;
                        let anoAux = parseInt(ano.trim()) + 1;
                        ano = anoAux.toString();
                } else {

                        mesAux += 1;
                }
            }

            if(mesAux.toString().length == 1) {

                mes = '0'.concat(mesAux.toString());
            } else {

                mes = mesAux.toString();
            }
            
            if(diaAux.toString().length == 1) {

                dia = '0'.concat(diaAux.toString());
            } else {

                dia = diaAux.toString();
            }   

            // Reconverte para display dd/MM/yyyy
            dataFinalDisplay = `${dia}/${mes}/${ano}`;
            
            setDataFinal(`${ano}-${mes}-${dia}`); //ISO
            setDataFinalDisplay(dataFinalDisplay);
        }        
        
    };

    const handleSubmit = async (e: React.FormEvent) => {
        
        e.preventDefault();

        if (aluno == null || !aluno.id || livros.length == 0 || !dataInicial) {
          
          setMensagem('Por favor, preencha os campos obrigatórios!');
          setTipoMensagem('error');
          setOpenSnackbar(true);
          return;
        }
    
        try {
    
          const reservaFormatado = {
            ...formatarReservaParaBackend()
          };
    
          // Chamada ao backend
          const response = await fetch(`${API_BASE_URL}/reserva`, {  // Ajuste a porta
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(reservaFormatado),
          });
    
        let errorMessage = 'Erro ao cadastrar reserva';
        if (!response.ok) {
          
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
          errorMessage = await response.text();
          console.log('Resposta do backend (texto):', errorMessage);
        
        }
        // Esperado: { id: 1, titulo: '...', qrCodeUrl: 'https://...' }
        
        setMensagem(errorMessage);
        setTipoMensagem('success');
        setOpenSnackbar(true);

        console.log('Reserva cadastrada:', data);
                
        handleLimpar();
    
      } catch (error: any) {
        console.error('Erro ao cadastrar livro:', error);
        setMensagem(error.message || 'Erro ao cadastrar livro. Tente novamente.');
        setTipoMensagem('error');
        setOpenSnackbar(true);
      }
    };
    
  const formatarReservaParaBackend = () => {
    return {
      
        copia: 1,
        dataInicial: dataInicial,
        dataFinal: dataFinal,
        livros: livros,
        idAluno: aluno?.id 
        
    };
  };

  const handleLimpar = () => {
    
    setLivros([]);
    
    setDataInicial('');
    setDataFinal('');
    setDataInicialDisplay('');
    setDataFinalDisplay('');
    //setAluno(alunosData[0]);
  };

    return (

        <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>

            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom color="primary" sx={{ mb: 3 }}>
                    📆 Reservas de Livros
                </Typography>
            
                <form onSubmit={handleSubmit}>
                    {/* Coluna dos Campos */}
                    <Grid item xs={12} md={6}>
                        <Grid container spacing={3}>
                            
                            <Grid item xs={12}>
                                
                                <Autocomplete
                                    disablePortal
                                    value={aluno}
                                    onChange={(event, newValue) => {
                                        setAluno(newValue);
                                    }}
                                    options={alunosData}
                                    getOptionLabel={(option) => option.nome}              
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    fullWidth
                                    renderInput={(params) => <TextField {...params} label="Alunos" />}
                                />
                            </Grid>

                            <Grid item xs={12}>

                                <Autocomplete
                                    multiple
                                    freeSolo
                                    options={livrosDisponiveis}
                                    getOptionLabel={(option) => typeof option === 'string' ? option : option.titulo}
                                    value={livros}
                                    inputValue={inputLivro}
                                    onInputChange={ async (event, newInputValue) => {
                                                  
                                        console.error('Entrou no onInputChange: ' + newInputValue);
                                        
                                        setInputLivro(newInputValue);

                                        console.error('Entrou no onChange');
                                        
                                        console.error('Passou no processandoEnter');

                                        try {
                                            const response = await axios.get(`${API_BASE_URL}/livro/pesquisar_livro?livro=${newInputValue}`);
                                            console.error(response.data);
                                            setLivrosDisponiveis(response.data);
                                        } catch (error) {
                                            console.error('Erro ao buscar autores:', error);
                                        } finally {
                                            setBuscandoLivro(false);
                                        }
                                        //setLivro(prev => ({ ...prev, autores: novosAutores }));
                                        console.error('Passou setInputLivro');
                                    }}
                                    onChange={ async (event, newValue) => {
                                        
                                        const livrosSelecionados = (newValue as any[]).filter(
                                            v => typeof v !== 'string'
                                        ) as Livro[];
                                        setLivros(livrosSelecionados);

                                    }}
                                    loading={buscandoLivro}
                                    renderTags={(value, getTagProps) =>
                                    value.map((option, index) => (
                                        <Chip
                                        label={option.titulo}
                                        {...getTagProps({ index })}
                                        color="primary"
                                        variant="outlined"
                                        />
                                    ))
                                    }
                                    renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Livros ou autores"
                                        placeholder="Digite o nome e pressione Enter"
                                        helperText="Digite o nome do livro ou autor e pressione Enter para adicionar"
                                    />
                                    )}
                                    renderOption={(props, option) => (
                                        <li {...props}>
                                            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
                                                <Avatar
                                                    src={`${API_BASE_URL_IMAGEM}/${option.imagem}`}  // ou option.imagem, option.urlCapa — depende do seu LivroTable
                                                    alt={option.titulo}
                                                    variant="rounded"
                                                    sx={{ width: 40, height: 56 }}  // proporção de livro
                                                />
                                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                            <Typography variant="body2">{option.titulo}</Typography>
                                                                { option.autores[0] && (
                                                            <Typography variant="caption" color="text.secondary">
                                                                {option.editora}
                                                            </Typography>
                                                )}
                                                </Box>
                                            </Box>
                                        </li>
                                    )}
                                />

                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Data inicial"
                                    name="dataInicial"
                                    value={dataInicialDisplay || (dataInicial ? formatarDataParaExibicao(dataInicial) : '')}
                                    onChange={(e) => handleDataChange(e, 'inicial')}
                                    onBlur={(e) => addDiasReservasDtFinal(e)}
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
                                    name="dataFinal"
                                    value={dataFinalDisplay || (dataFinal ? formatarDataParaExibicao(dataFinal) : '')}
                                    onChange={(e) => handleDataChange(e, 'inicial')}
                                    placeholder="dd/MM/yyyy"
                                    inputProps={{ 
                                        maxLength: 10
                                    }}
                                    helperText="Formato: dd/MM/yyyy"
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
                                    disabled={loading}
                                >
                                    Salvar reserva
                                </Button>
                                </Box>
                            </Grid>

                            <Grid item xs={12}>
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
                                        <TableCell sx={{ color: 'white', fontWeight: 'bold', width: 150 }}>
                                            Datas
                                        </TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 'bold', width: 150 }}>
                                            Período
                                        </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {reservas.map((article, index) => (
                                            article.livros.map((article_2, index_2) => (
                                            <TableRow
                                                key={index}
                                                sx={{
                                                '&:nth-of-type(odd)': { backgroundColor: 'action.hover' },
                                                '&:hover': { backgroundColor: 'action.selected' },
                                                }}
                                            >
                                                <TableCell>
                                                    {
                                                        <img
                                                            src={article_2.imagem ?? ''}
                                                            alt={article_2.titulo}
                                                            style={{
                                                                width: 100,
                                                                height: 60,
                                                                objectFit: 'cover',
                                                                borderRadius: 4,
                                                            }}                                                        
                                                        />
                                                    }
                                                </TableCell>
                                                
                                                <TableCell>
                                                <Chip
                                                    label={article_2.categoria?.caminhoCategoria}
                                                    size="small"
                                                    color={
                                                        article_2.categoria?.caminhoCategoria?.includes('Engineering')
                                                            ? 'primary'
                                                        : article_2.categoria?.caminhoCategoria?.includes('Product')
                                                            ? 'success'
                                                        : article_2.categoria?.caminhoCategoria?.includes('Design')
                                                            ? 'secondary'
                                                        : 'default'
                                                    }
                                                />
                                                </TableCell>
                                                
                                                <TableCell>
                                                    <Typography variant="body2" fontWeight="medium">
                                                        {article_2.titulo}
                                                    </Typography>
                                                </TableCell>
                                                
                                                <TableCell>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {article_2.descricao}
                                                    </Typography>
                                                </TableCell>
                                                
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <AvatarGroup max={2}>
                                                        {article_2.autores.map((author, authorIndex) => (
                                                            <Avatar key={authorIndex} alt={author.nome} sx={{ width: 28, height: 28 }}>
                                                                {author.nome.charAt(0)}
                                                            </Avatar>
                                                        ))}
                                                        </AvatarGroup>
                                                        <Typography variant="caption" sx={{ display: { xs: 'none', md: 'block' } }}>
                                                            {article_2.autores.length > 1 ? `${article_2.autores.length} autores` : article_2.autores[0].nome}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    {article.dataInicial} {article.dataFinal ? article.dataFinal : ' - ' + article.dataFinal}
                                                </TableCell>
                                            </TableRow>
                                        ))))}
                                    </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>

                        </Grid>
                    </Grid>
                </form>
            </Paper>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={4000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }} >
            <Alert
                  onClose={() => setOpenSnackbar(false)}
                  severity={tipoMensagem}
                  sx={{ width: '100%' }} >
                  {mensagem}
            </Alert>
            </Snackbar>

        </Box>
    );
}