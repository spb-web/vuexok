import { modules } from './vuexok'
import { ActionHandler } from './vuexok'

export const vuexokWorkerWrapper = (worker:Worker) => {
  const vuexokWorkerEventHandler = async (event:MessageEvent) => {
    if (event.data.type === 'vuexok:action') {
      const { path, action, payload, callbackId } = event.data

      try {
        const module = modules.get(path)

        if (!module) {
          throw new Error(`not found module ${path}`)
        }

        const moduleAction = module.actions[
          action as keyof typeof module.actions
        ] as ActionHandler<(p:any) => any>
    
        if (!moduleAction) {
          throw new Error(`not found action ${action}`)
        }

        const result = await moduleAction(payload)

        worker.postMessage({
          type: 'vuexok:action:resolve',
          result,
          callbackId,
        })
      } catch (error) {
        worker.postMessage({
          type: 'vuexok:action:reject',
          errorMessage: `[Vuexok/vuexokWorkerWrapper/${path}/${action}]: ${
            error.messgae ?? (
              typeof error === 'string' ? error : 'Unknow error;'
            )
          }`,
          callbackId,
        })
      }
    }
  }

  worker.addEventListener('message', vuexokWorkerEventHandler)

  const unbind = () => {
    worker.removeEventListener('message', vuexokWorkerEventHandler)
  }

  return unbind
}
