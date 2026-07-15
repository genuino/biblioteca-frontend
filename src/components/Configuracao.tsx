import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { APP_TIPO_CONF, API_BASE_URL } from '../Constantes';
import { NumericFormat, type NumberFormatValues } from 'react-number-format';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import * as Constantes from '../Constantes';

const NumericFormatFixed = NumericFormat as any;

interface Configuracao {
    id: number,
    qtasReservas: number,
    qtosDiasReserva: number,
    diariaEmprestimo: number,
    qtosEmprestimo: number,
    jurosAtrasoDiario: number,
    jurosAtrasoMulta: number,
    qtosDiasPenalizacao: number,
    qtasInfracoesPenalizacao: number,
    valorDiariaMulta: number,
    periodoPenalizacao: number
}

const periodoPenalData = [
  {
    id: Constantes.FORMAT_PERIODO_PENALIZACAO_MENSAL,
    periodo: 'Mensal',
  },
  {
    id: Constantes.FORMAT_PERIODO_PENALIZACAO_BIMESTRAL,
    periodo: 'Bimestral',
  },
  {
    id: Constantes.FORMAT_PERIODO_PENALIZACAO_TRIMESTRAL,
    periodo: 'Trimestral',
  },
  {
    id: Constantes.FORMAT_PERIODO_PENALIZACAO_SEMESTRAL,
    periodo: 'Semestral',
  },
  {
    id: Constantes.FORMAT_PERIODO_PENALIZACAO_ANUAL,
    periodo: 'Anual',
  },
  {
    id: Constantes.FORMAT_PERIODO_PENALIZACAO_ETERNO,
    periodo: 'Eterno',
  },
];

export default function Configuracao() {

    const [configuracao, setConfiguracao] = React.useState<Configuracao>({
        id: -1,
        qtasReservas: 0,
        qtosDiasReserva: 0,
        diariaEmprestimo: 0,
        qtosEmprestimo: 0,
        jurosAtrasoDiario: 0,
        jurosAtrasoMulta: 0,
        qtosDiasPenalizacao: 0,
        qtasInfracoesPenalizacao: 0,
        valorDiariaMulta: 0,
        periodoPenalizacao: Constantes.FORMAT_PERIODO_PENALIZACAO_ANUAL,
    });

    const [periodoPenalizacao, setPeriodoPenalizacao] = React.useState<{ id: number; periodo: string; } | null>(periodoPenalData[4]);
    const [valorDiariaMultaDisplay, setValorDiariaMultaDisplay] = React.useState('');
    const [jurosAtrasoDiarioDisplay, setJurosAtrasoDiarioDisplay] = React.useState(configuracao.jurosAtrasoDiario + '%');
    const [jurosAtrasoMultaDisplay, setJurosAtrasoMultaDisplay] = React.useState(configuracao.jurosAtrasoMulta + '%');
    const [mensagem, setMensagem] = React.useState('');
    const [tipoMensagem, setTipoMensagem] = React.useState<'success' | 'error'>('success');
    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    
    // Carregar categorias ao montar o componente												 
    useEffect(() => {
        carregarConfiguracao();
    }, []);    

    // Carregar categorias do backend
    const carregarConfiguracao = async () => {
        
        try {
            const response = await fetch(`${API_BASE_URL}/configuracao/pesquisar_conf?tipoConfiguracao=${APP_TIPO_CONF}`);
            if (response.ok) {

                const data = await response.json();
                setConfiguracao(data);
                
                // Atualizar os displays com os valores do backend
                setJurosAtrasoDiarioDisplay(data.jurosAtrasoDiario + '%');
                setJurosAtrasoMultaDisplay(data.jurosAtrasoMulta + '%');
                setValorDiariaMultaDisplay('R$ ' + data.valorDiariaMulta.toFixed(2).replace('.', ','));

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

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,tipo: number) => {
        
        let fazerBackSpace = false;
        if(!event.target.value.includes('%')) {

            fazerBackSpace = true;
        }

        let value = event.target.value.replace('%', '').replace(/^0+(?=\d)/, '');
        
        // Regex: Permite apenas números e UMA única vírgula ou ponto
        // Substituímos vírgula por ponto para facilitar o cálculo depois
        const regex = /^[0-9]*[.,]?[0-9]*$/;

        if(fazerBackSpace) {

            value = value.length == 1 ? '0' : value.slice(0, -1);

        }

        if (regex.test(value)) {
            setConfiguracao(prev => {
                const updated = { ...prev };

                if(tipo == Constantes.FORMAT_JUROS_ATRASO_DIARIO) {
                    
                    updated.jurosAtrasoDiario = parseFloat(value.replace(",", "."));
                    setJurosAtrasoDiarioDisplay(value.replace(",", ".") + '%');

                } else if(tipo == Constantes.FORMAT_JUROS_ATRASO_MULTA) {

                    updated.jurosAtrasoMulta = parseFloat(value.replace(",", "."));
                    setJurosAtrasoMultaDisplay(value.replace(",", ".") + '%');

                } 
                
                return updated;
            });
        }
    };
    
    const handleChangeInteiros = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,tipo: number) => {
        
        const { value } = event.target;
                
        // Permite apenas dígitos (0-9)
        if (/^\d*$/.test(value)) {

            setConfiguracao(prev => {
                const updated = { ...prev };

                if (tipo === Constantes.FORMAT_DIARIA_EMPRESTIMO) {
                    updated.diariaEmprestimo = Number(value);
                } else if (tipo === Constantes.FORMAT_QTOS_LIVROS_EMPRESTIMO) {
                    updated.qtosEmprestimo = Number(value);
                } else if (tipo === Constantes.FORMAT_QTOS_DIAS_PENALIZACAO) {
                    updated.qtosDiasPenalizacao = Number(value);
                } else if (tipo === Constantes.FORMAT_QTOS_DIAS_RESERVA) {
                    updated.qtosDiasReserva = Number(value);
                } else if (tipo === Constantes.FORMAT_QTOS_INFRACOES_PENALIZACAO) {
                    updated.qtasInfracoesPenalizacao = Number(value);
                } else if (tipo === Constantes.FORMAT_QTAS_RESERVAS) {
                    updated.qtasReservas = Number(value);
                }

                return updated;
            }); 

        }  
    };

    const handleSubmit = async (e: React.FormEvent) => {
        
        e.preventDefault();
      
        if (configuracao == null  || !configuracao.diariaEmprestimo) {
          
          setMensagem('Por favor, preencha os campos obrigatórios!');
          setTipoMensagem('error');
          setOpenSnackbar(true);
          return;
        }
    
        try {
    
          const payload = {
            ...configuracao,
            // valorDiariaMulta: 1000 — pronto para o backend
          };

          const response = await axios.post(`${API_BASE_URL}/configuracao`, payload);
          
          console.log(response.data);

          setMensagem('Dados salvo com sucesso!');
          setTipoMensagem('success');
          setOpenSnackbar(true);
        
          carregarConfiguracao();

      } catch (error: any) {
        
        console.error('Erro ao cadastrar livro:', error);
        
        let errorMessage = 'Erro ao salvar configuração';

        if (axios.isAxiosError(error)) {
            // error.response existe quando o backend respondeu (4xx, 5xx)
            errorMessage = error.response?.data?.message  // JSON com campo message
                        || error.response?.data           // JSON direto (string)
                        || error.message                  // Fallback do axios (ex: "Network Error")
        }

        setMensagem(error.message || 'Erro ao salvar configuração. Tente novamente.');
        setTipoMensagem('error');
        setOpenSnackbar(true);

        throw new Error(errorMessage);

      }
    };

    return (

        <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>

            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom color="primary" sx={{ mb: 3 }}>
                    ⚙️ Configuração
                </Typography>
            
                <form onSubmit={handleSubmit}>
                    {/* Coluna dos Campos */}
                    <Grid item xs={12} md={6}>
                        <Grid container spacing={3}>
                                  
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Quantos dias de empréstimo*"
                                    name="diariaEmprestimo"
                                    value={(configuracao.diariaEmprestimo)}
                                    onChange={(e) => handleChangeInteiros(e, Constantes.FORMAT_DIARIA_EMPRESTIMO)}
                                    inputProps={{ 
                                        maxLength: 10
                                    }}
                                    placeholder="0"
                                />
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Máximos de livros para empréstimo*"
                                    name="qtosEmprestimo"
                                    value={(configuracao.qtosEmprestimo)}
                                    onChange={(e) => handleChangeInteiros(e, Constantes.FORMAT_QTOS_LIVROS_EMPRESTIMO)}
                                    inputProps={{ 
                                        maxLength: 10
                                    }}
                                    placeholder="0"
                                />
                            </Grid>
                                              
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Reservar por quantos dias"
                                    name="qtosDiasReserva"
                                    value={(configuracao.qtosDiasReserva)}
                                    inputProps={{ 
                                        maxLength: 3
                                    }}
                                    onChange={(e) => handleChangeInteiros(e, Constantes.FORMAT_QTOS_DIAS_RESERVA)}
                                    placeholder="0"
                                />
                            </Grid>
                                                    
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Quantas reservas"
                                    name="qtasReservas"
                                    value={(configuracao.qtasReservas)}
                                    inputProps={{ 
                                        maxLength: 3
                                    }}
                                    onChange={(e) => handleChangeInteiros(e, Constantes.FORMAT_QTAS_RESERVAS)}
                                    placeholder="0"
                                />
                            </Grid>
                                                    
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Valor dos juros diário"
                                    name="jurosAtrasoDiario"
                                    value={jurosAtrasoDiarioDisplay}
                                    onChange={(e) => handleChange(e, Constantes.FORMAT_JUROS_ATRASO_DIARIO)}
                                    placeholder="0.00%"
                                    inputProps={{ 
                                        maxLength: 10
                                    }}
                                />
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Valor do juro de atraso"
                                    name="jurosAtrasoMulta"
                                    value={jurosAtrasoMultaDisplay}
                                    onChange={(e) => handleChange(e, Constantes.FORMAT_JUROS_ATRASO_MULTA)}
                                    placeholder="0.00%"
                                    inputProps={{ 
                                        maxLength: 10
                                    }}
                                    
                                />
                            </Grid>
                                                    
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Quantos dias de penalização"
                                    name="qtosDiasPenalizacao"
                                    value={(configuracao.qtosDiasPenalizacao)}
                                    onChange={(e) => handleChangeInteiros(e, Constantes.FORMAT_QTOS_DIAS_PENALIZACAO)}
                                    placeholder="0"
                                    inputProps={{ 
                                        maxLength: 10
                                    }}
                                    helperText="Formato: 10"
                                />
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Quantas infrações para multar e penalizar"
                                    name="qtasInfracoesPenalizacao"
                                    value={configuracao.qtasInfracoesPenalizacao}
                                    onChange={(e) => handleChangeInteiros(e, Constantes.FORMAT_QTOS_INFRACOES_PENALIZACAO)}
                                    placeholder="0"
                                    inputProps={{ 
                                        maxLength: 10
                                    }}
                                    helperText="Formato: 10"
                                />
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                                
                                <Autocomplete
                                    disablePortal
                                    value={periodoPenalizacao}
                                    onChange={(event, newValue) => {
                                        
                                        setConfiguracao(prev => ({
                                            ...prev,
                                            periodoPenalizacao: newValue ? newValue.id : 0
                                        }));
                                        setPeriodoPenalizacao(newValue);
                                    }}
                                    options={periodoPenalData}
                                    getOptionLabel={(option) => option.periodo}              
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    fullWidth
                                    renderInput={(params) => <TextField {...params} label="Período para penalização" />}
                                />
                            </Grid>
                      
                            <Grid item xs={12} md={6}>
                                
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
                                        setConfiguracao(prev => ({
                                            ...prev,
                                            valorDiariaMulta: values.floatValue ?? 0
                                        }));
                                    }}
                                />

                            </Grid>
                            
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                >
                                    Cadastrar Configuração
                                </Button>
                                </Box>
                            </Grid>
                            
                        </Grid>
                    </Grid>
                </form>
                
            </Paper>

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