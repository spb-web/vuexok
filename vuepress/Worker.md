# Calling actions from a worker
[Workers](https://developer.mozilla.org/en/docs/DOM/Using_web_workers) are used to optimize the main thread. In a worker, you can perform complex calculations that could lead to drawdowns in the main thread. And then you need to transfer the result of calculations to the main thread. If you use vuex, then most often you will need to transfer the results of calculating workers to the storage.

It's very easy to do this with Vuexok. Vuexok allows you to proxy action methods into workers.
## Improvement of worker initialization
After initializing the worker, you need to pass it to the `vuexokWorkerWrapper` method

```js
import { vuexokWorkerWrapper } from 'vuexok/dist/vuexokWorkerWrapper'
const worker = new Worker('./worker')
vuexokWorkerWrapper(worker)
```
That being said, you can also use [comlink](https://github.com/GoogleChromeLabs/comlink) with vuexok.
## Improvement of the worker
Now let's move on to the worker code. In order for the actions of the module to be available in the worker, 3 lines are enough.
In the worker code, import the `vuexokWorkerGetActions` method, which will return methods for calling the module's actions.

```js
import { vuexokWorkerGetActions } from 'vuexok/dist/vuexokWorkerGetActions'
```
The worker does not know anything about our store and modules, so we need to import the module type into the worker.

Since we do not want vuex and the code of our module in the worker, we only import the type of the module. Typescript versions higher than [3.8](https://devblogs.microsoft.com/typescript/announcing-typescript-3-8-beta/) only allow importing of the type.

```js
import type {countModule} from '@/store/modules/countModule'
```
Now we can access the actions of our module from the worker. The `vuexokWorkerGetActions` method takes one required parameter - the path to the vuex module.
```js
const countModuleActions = vuexokWorkerGetActions<typeof countModule>('countModule')
```

Simple example (20 seconds)
<video width="560" height="240" controls style="width: 100% !important;height: auto!important;">
  <source src="/vuexok/video/createWorker.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

## Action error handling
For interaction between the worker and the main thread, the [postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Worker/postMessage) method is used. 

`postMessage` uses [the structured cloning algorithm](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm).
Implementation in ff does not [support passing native errors objects](https://bugzilla.mozilla.org/show_bug.cgi?id=1556604).

For this original error object, vuexok passes the `message` field of the [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) object to the worker, and a new instance of` new Error (message) `is created inside the worker.
