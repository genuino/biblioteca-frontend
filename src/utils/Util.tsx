export const eBissexto = (ano: number): boolean => {
    return (ano % 4 === 0 && ano % 100 !== 0) || (ano % 400 === 0);
};

export const aplicarMascara = (raw: string): string => {
    let value = raw.replace(/\D/g, ''); // Remove tudo que não é dígito
    
    if (value.length <= 2) {
        return value;
    } else if (value.length <= 4) {
        return value.slice(2, 4) + '/' + value.slice(0, 2);
    } else if (value.length <= 6) {
        return value.slice(4, 6) + '/' + value.slice(2, 4) + '/' + value.slice(0, 2);
    } else {
        return value.slice(6, 8) + '/' + value.slice(4, 6) + '/' + value.slice(0, 4);
    }
};


export const formatarDataBR = (raw: string): string => {
    let value = raw.replace(/\D/g, ''); // Remove tudo que não é dígito
    
    if (value.length <= 2) {
        return value;
    } else if (value.length <= 4) {
        return value.slice(0, 2) + '/' + value.slice(2, 4);
    } else if (value.length <= 6) {
        return value.slice(0, 2) + '/' + value.slice(2, 4) + '/' + value.slice(4, 6);
    } else {
        return value.slice(0, 2) + '/' + value.slice(2, 4) + '/' + value.slice(4, 8);
    }
};


export const formatarDataISO = (raw: string): string => {
  //let value = raw.replace(/\D/g, ''); // Remove tudo que não é dígito

  // Converte para formato ISO antes de salvar no estado
  let dataISO = '';
  if (raw.length === 10) {
    const [dia, mes, ano] = raw.split('/');
    dataISO = `${ano}-${mes}-${dia}`;
  }

  return dataISO;
};

