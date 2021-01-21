import { modules } from './vuexok'
import type { ActionHandler } from './vuexok'
import type { VuexokActionCallEvent } from './vuexokWorkerGetActions'

export type VuexokActionResolveEvent = {
  type: 'vuexok:action:resolve',
  result: any,
  vuexokCallbackId: string,
}

export type VuexokActionRejectEvent = {
  type: 'vuexok:action:reject',
  errorMessage: string,
  vuexokCallbackId: string,
}

export const vuexokWorkerWrapper = (worker:Worker) => {
  const vuexokWorkerEventHandler = async (
    event:MessageEvent<VuexokActionCallEvent>
  ) => {
    if (event.data.type === 'vuexok:action') {
      const { path, action, payload, vuexokCallbackId } = event.data

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
        const eventData:VuexokActionResolveEvent = {
          type: 'vuexok:action:resolve',
          result,
          vuexokCallbackId,
        }

        worker.postMessage(eventData)
      } catch (error) {
        const eventData:VuexokActionRejectEvent = {
          type: 'vuexok:action:reject',
          errorMessage: `[Vuexok/vuexokWorkerWrapper/${path}/${action}]: ${
            error.messgae ?? (
              typeof error === 'string' ? error : 'Unknow error;'
            )
          }`,
          vuexokCallbackId,
        }

        worker.postMessage(eventData)
      }
    }
  }

  worker.addEventListener('message', vuexokWorkerEventHandler)

  const unbind = () => {
    worker.removeEventListener('message', vuexokWorkerEventHandler)
  }

  return unbind
}
