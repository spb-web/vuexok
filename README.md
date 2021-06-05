[En](https://github.com/spb-web/vuexok#readme) [Ru](https://github.com/spb-web/vuexok/blob/master/README_RU.md)

# Vuexok

[![npm bundle size](https://img.shields.io/bundlephobia/minzip/vuexok?color=%233eaf7c&style=for-the-badge&logo=appveyor)](https://bundlephobia.com/result?p=vuexok)

Vuexok does not replace the vuex api, but extends it by adding typescript support and allowing actions and mutations without explicitly using [commit](https://vuex.vuejs.org/guide/mutations.html) and [dispatch](https://vuex.vuejs.org/guide/actions.html#dispatching-actions).
So the migration is mostly fast.

- You no longer need constants for actions and mutations
- More convenient work with watchers
- Full typescript support
- Easy migration from vuex: you don't have to rewrite everything
- Compatible with vuex 4 and vue 3
- Small size vuexok
- Calling actions from web workers
- SSR

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