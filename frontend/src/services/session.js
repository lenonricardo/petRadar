import api from './api'

async function retornarSessaoUsuario()
{
   const response = await api.get('/auth/session')
   return response.data
}

// export const session = async () => {
//    let sessao = await api.get('/auth/session')
//    return sessao
// }

const session = retornarSessaoUsuario()

export default session;






