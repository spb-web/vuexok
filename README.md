# Vuexok

vuexok маленький пакет для больших проектов. 

[![npm bundle size](https://img.shields.io/bundlephobia/minzip/vuexok?color=%233eaf7c&style=for-the-badge&logo=appveyor)](https://bundlephobia.com/result?p=vuexok)

Vuexok не заменяет api vuex, а расширяет его, добавляя поддержку типов typescript и дает возможность использовать экшены и мутации без явного использования [commit](https://vuex.vuejs.org/guide/mutations.html) и [dispatch](https://vuex.vuejs.org/guide/actions.html#dispatching-actions) .
По этому миграция в большенстве случает пройдет быстро и безболезненно

## Документация
[https://spb-web.github.io/vuexok/](https://spb-web.github.io/vuexok/)

Будет здорово если придут пулреквесты с дополнениями к документации и с переводами

## Установка
### NPM
```
npm install vuexok --save
```

### Yarn
```
yarn add vuexok
```

## Что даст vuexok
- Больше не нужны константы для экшенов и мутаций
- Более удобная работа с вотчерами
- Полная поддержка typescript
- Простая миграция с vuex: вам не придется всё переписывать
- Совместимо с vuex 4 и vue
- Маленький размер vuexok
- Вызов экшенов из веб-воркеров

## Примеры
- [Vuexok hello-world (FizzBuzz)](https://codesandbox.io/s/vuexok-hello-world-fizzbuzz-9phvr?eslint=1&fontsize=14&hidenavigation=1&module=%2Fsrc%2FApp.vue&theme=dark)