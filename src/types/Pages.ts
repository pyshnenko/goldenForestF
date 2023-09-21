import {Roles, Paths} from 'types/Enums'

export default {
    login: {
        url: Paths.Login,
    },
    register: {
        url: Paths.Register,
    },
    main: {
        url: Paths.Main,
    },
    members: {
        url: Paths.Members,
        role: [Roles.Secretary, Roles.Treasurer],
        name: 'Участники'
    },
    join: {
        url: Paths.Join,
        role: [Roles.Stranger],
        name: 'Заявка'
    },
    joined: {
        url: Paths.Joined,
        role: [Roles.Secretary],
        name: 'Заявки'
    },
    baned: {
        url: Paths.Ban,
        role: [Roles.Secretary],
        name: 'Бан-лист'
    },
    treasury: {
        url: Paths.Treasury,
        role: [Roles.Treasurer],
        name: 'Казна'
    }
}