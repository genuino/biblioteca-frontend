export const eBissexto = (ano: number): boolean => {
    return (ano % 4 === 0 && ano % 100 !== 0) || (ano % 400 === 0);
};

export const aplicarMascara = (value: string): string => {
        
    if (value.length <= 2) {
        return value;
    } else if (value.length <= 4) {
        return value.slice(0, 2) + '/' + value.slice(2);
    } else if (value.length <= 6) {
        return value.slice(0, 2) + '/' + value.slice(2, 4) + '/' + value.slice(4);
    } else {
        return value.slice(0, 2) + '/' + value.slice(2, 4) + '/' + value.slice(4, 8);
    }
};
