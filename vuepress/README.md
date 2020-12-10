# Vuex на максималках вместе с Vuexok

vuexok маленький пакет для больших проектов. 

[![npm bundle size](https://img.shields.io/bundlephobia/minzip/vuexok?color=%233eaf7c&style=for-the-badge&logo=appveyor)](https://bundlephobia.com/result?p=vuexok)

::: tip
Vuexok не заменяет api vuex, а расширяет его, добавляя поддержку типов typescript и дает возможность использовать экшены и мутации без явного использования [commit](https://vuex.vuejs.org/guide/mutations.html) и [dispatch](https://vuex.vuejs.org/guide/actions.html#dispatching-actions), поэтому миграция в большинстве случает пройдет быстро и безболезненно.
:::

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
