Поддержка пакета прекращена, рекомендую перейти на https://pinia.vuejs.org/

# Vuex at powerful with Vuexok

[![npm bundle size](https://img.shields.io/bundlephobia/minzip/vuexok?color=%233eaf7c&style=for-the-badge&logo=appveyor)](https://bundlephobia.com/result?p=vuexok)

Vuexok does not replace the vuex api, but extends it by adding support for typescript and makes it possible to use actions and mutations without explicitly using [commit](https://vuex.vuejs.org/guide/mutations.html) and [dispatch](https://vuex.vuejs.org/guide/actions.html#dispatching-actions).
Therefore, migration in most cases will be quick.

## Features
- No more constants needed for actions and mutations
- More convenient work with watchers
- Full typescript support
- Easy migration from vuex. You don't have to rewrite everything
- vuex 4 and vue 3 support
- Small size vuexok
- Calling actions from web workers
- ssr support

## Docs
[https://spb-web.github.io/vuexok/](https://spb-web.github.io/vuexok/)

## Install
### NPM
```
npm install vuexok --save
```

### Yarn
```
yarn add vuexok
```

## Example
- [Vuexok hello-world (FizzBuzz)](https://codesandbox.io/s/vuexok-hello-world-fizzbuzz-9phvr?eslint=1&fontsize=14&hidenavigation=1&module=%2Fsrc%2FApp.vue&theme=dark)

## Used
[<img src="https://raw.githubusercontent.com/spb-web/vuexok/master/docs/nominex.png" width="200" />](https://nominex.io?r=22)

