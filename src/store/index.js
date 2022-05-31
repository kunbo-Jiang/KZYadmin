
import { createStore } from 'vuex'

const path = require('path')
const requireModules = require.context('./modules', true, /index\.(ts|js)$/iu)

const modules = {}

requireModules.keys().forEach(filePath => {
  const modular = requireModules(filePath)
  let name = path.resolve(filePath, '..')
  name = name.split('/').pop()
  modules[name] = {
    namespaced: true,
    ...modular.default
  }
})

const store = createStore({
  modules: {
    ...modules
  }
})

export default store
