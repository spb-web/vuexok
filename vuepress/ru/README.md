# Vuex на максималках вместе с Vuexok

::: tip
Начиная с версии 1.х.х была изменена инициализация модуля для поддержки ssr. [Подробнее](MigrateTo1.x.x.html)
::: 

vuexok маленький пакет для больших проектов. 

[![npm bundle size](https://img.shields.io/bundlephobia/minzip/vuexok?color=%233eaf7c&style=for-the-badge&logo=appveyor)](https://bundlephobia.com/result?p=vuexok)

Vuexok не заменяет api vuex, а расширяет его, добавляя поддержку типов typescript и дает возможность использовать экшены и мутации без явного использования [commit](https://vuex.vuejs.org/guide/mutations.html) и [dispatch](https://vuex.vuejs.org/guide/actions.html#dispatching-actions), поэтому миграция в большинстве случает пройдет быстро и безболезненно.

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
- Полная поддержка typescript :tada:
- Простая миграция с vuex: вам не придется всё переписывать
- Совместимо с vuex 4 и vue 3 :fire:
- Маленький размер vuexok
- Вызов экшенов из веб-воркеров
- Поддержка ssr :metal:

## Примеры
- [Vuexok hello-world (FizzBuzz)](https://codesandbox.io/s/vuexok-hello-world-fizzbuzz-9phvr?eslint=1&fontsize=14&hidenavigation=1&module=%2Fsrc%2FApp.vue&theme=dark)
