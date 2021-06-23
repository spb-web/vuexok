# Vuex at powerful with Vuexok

::: tip
Starting from version 1.х.х, the module initialization has been changed to support ssr. [More details](MigrateTo1.x.x.html)
::: 

[![npm bundle size](https://img.shields.io/bundlephobia/minzip/vuexok?color=%233eaf7c&style=for-the-badge&logo=appveyor)](https://bundlephobia.com/result?p=vuexok)

Vuexok does not replace the vuex api, but extends it by adding support for typescript and makes it possible to use actions and mutations without explicitly using [commit](https://vuex.vuejs.org/guide/mutations.html) and [dispatch](https://vuex.vuejs.org/guide/actions.html#dispatching-actions).
Therefore, migration in most cases will be quick.

## Install
### NPM
```
npm install vuexok --save
```

### Yarn
```
yarn add vuexok
```

## Features
- No more constants needed for actions and mutations
- More convenient work with watchers
- Full typescript support :tada:
- Easy migration from vuex. You don't have to rewrite everything
- vuex 4 and vue 3 support :fire:
- Small size vuexok
- Calling actions from web workers
- ssr support :metal:

## Examples
- [Vuexok hello-world (FizzBuzz)](https://codesandbox.io/s/vuexok-hello-world-fizzbuzz-9phvr?eslint=1&fontsize=14&hidenavigation=1&module=%2Fsrc%2FApp.vue&theme=dark)