import { loginPath } from './paths/login-path'
import { badRequest, unauthorized, serverError } from './components/index'
import { accountSchema } from './schemas/account.schema'
import { errorSchema } from './schemas/error.schema'
import { loginParamsSchema } from './schemas/login-params.schema'

export default {
    openapi: '3.0.0',
    info: {
        title: 'Clean Node Api',
        description: 'API do curso do mango para realizar enquetes entre programadores',
        version: '1.0.0'
    },
    license: {
        name: 'GPL-3.0-or-later',
        url: 'https://spdx.org/licenses/GPL-3.0-or-later.html'
    },
    servers: [{
        url: '/api'
    }],
    tags: [{
        name: 'Login'
    }],
    paths: {
        '/login': loginPath
    },
    schemas: {
        account: accountSchema,
        loginParams: loginParamsSchema,
        error: errorSchema
    },
    components: {
        badRequest, unauthorized, serverError
    }
}