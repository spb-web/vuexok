import { vuexokWorkerGetActions } from '../../dist/vuexokWorkerGetActions'
import type {countModule} from './store/countModule'

const countModuleActions = vuexokWorkerGetActions<typeof countModule>('countModule')

setTimeout(() => countModuleActions.increment(), 1)
