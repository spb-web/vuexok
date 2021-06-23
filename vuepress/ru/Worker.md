# Экшены из воркера
Для "разгрузки" основного потока применяются [воркеры](https://developer.mozilla.org/ru/docs/DOM/Using_web_workers). В воркере можно проводить сложные вычисления, которые могли бы привести к просадкам в основном потоке. И затем необходимо передать результат вычислений в основной поток. Если вы используете vuex, то чаще всего вам будет необходимо результаты вычисления воркеров передать в хранилище. 

С Vuexok это сделать очень просто. Vuexok позволяет проксировать методы экшенов в воркеры.
## Доработка инициализации воркера
После инициализации воркера надо передать его в метод `vuexokWorkerWrapper`

```js
import { vuexokWorkerWrapper } from 'vuexok/dist/vuexokWorkerWrapper'
const worker = new Worker('./worker')
vuexokWorkerWrapper(worker)
```
При этом вы можете так же использовать [comlink](https://github.com/GoogleChromeLabs/comlink) вместе с vuexok.
## Доработка воркера
Теперь перейдем к коду воркера. Что бы в воркере были доступны экшены модуля достаточно буквально 3 строки.
В коде воркера импортируем метод `vuexokWorkerGetActions`, который нам вернет методы для вызова экшенов модуля.

```js
import { vuexokWorkerGetActions } from 'vuexok/dist/vuexokWorkerGetActions'
```
Воркер ничего не знает о нашем сторе и модулях, поэтому надо импортировать в воркер тип модуля.

Так как мы не хотим, чтобы в воркере был vuex и код нашего модуля, то импортируем только тип модуля. Typescript версии выше [3.8](https://devblogs.microsoft.com/typescript/announcing-typescript-3-8-beta/) позволяет импортировать только тип.
```js
import type {countModule} from '@/store/modules/countModule'
```
Теперь мы можем получить доступ к экшенам нашего модуля из воркера. Метод `vuexokWorkerGetActions` принимает один обязательный параметр - путь к модулю vuex.
```js
const countModuleActions = vuexokWorkerGetActions<typeof countModule>('countModule')
```

Простой пример (20 секунд)
<video width="560" height="240" controls style="width: 100% !important;height: auto!important;">
  <source src="/vuexok/video/createWorker.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

## Обработка ошибок экшена
Для взаимодействия воркера и основного потока используется метод [postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Worker/postMessage). 

`postMessage` использует [алгоритм структурированного клонирования](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm), реализация которого в ff не [поддерживает передачу нативных ошибок](https://bugzilla.mozilla.org/show_bug.cgi?id=1556604). По этому вместо оригинального объекта ошибки vuexok передает в воркер поле `message` объекта [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) и внутри воркера создается новый экземпляр ошибки `new Error(message)`
