export const banTime = [
    {name: '1 день', value: '1d'},
    {name: '1 неделя', value: '1w'},
    {name: '1 месяц', value: '1m'},
    {name: '3 месяца', value: '3m'},
    {name: '6 месяцев', value: '6m'},
    {name: '9 месяцев', value: '9m'},
    {name: '1 год', value: '12y'},
    {name: 'Бессрочно', value: 'perm'}
]

export interface banVal {
    name: string,
    value: string 
}

export const banTo = (val: string) => {
    if (val !== '') {
        if (val === 'perm') return (new Date((new Date()).setFullYear(2200))).toJSON()
        else if (val === '1d') return (new Date((new Date()).setDate((new Date()).getDate() + 1))).toJSON()
        else if (val === '1w') return (new Date((new Date()).setDate((new Date()).getDate() + 7))).toJSON()
        else if (val === '1y') return (new Date((new Date()).setFullYear((new Date()).getFullYear() + 1))).toJSON()
        else if (val[1] === 'm') return (new Date((new Date()).setMonth((new Date()).getMonth() + Number(val[0])))).toJSON()
        else return null
    }
    else return null
}

export interface moneyTotalValue {load: boolean, value: {login: string, total: number}[]}