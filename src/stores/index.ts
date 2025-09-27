import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import useUserStore from './modules/user'
import useRouteCacheStore from './modules/routeCache'
import useAppStore from './modules/app'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

export { useUserStore, useRouteCacheStore, useAppStore }
export default pinia
