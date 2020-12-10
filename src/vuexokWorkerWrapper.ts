import { modules } from './vuexok'
import { ActionHandler } from './vuexok'

export const vuexokWorkerWrapper = (worker:Worker) => {
  const vuexokWorkerEventWrapper = async (event:MessageEvent) => {
    if (event.data.type === 'vuexok:action') {
      const { path, action, payload, callbackId } = event.data

      try {
        const module = modules.get(path)
    
        if (!module) {
          throw new Error()
        }
    
        const moduleAction = module.actions[
          action as keyof typeof module.actions
        ] as ActionHandler<(p:any) => any>
    
        if (!moduleAction) {
          throw new Error()
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
          error,
          callbackId,
        })
      }
    }
  }

  worker.addEventListener('message', vuexokWorkerEventWrapper)
}
