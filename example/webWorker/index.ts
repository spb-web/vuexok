import { vuexokWorkerWrapper } from '../../src/vuexokWorkerWrapper'

const worker = new Worker('./worker')

vuexokWorkerWrapper(worker)
