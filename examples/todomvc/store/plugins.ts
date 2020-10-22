import { Plugin } from 'vuex'
import { STORAGE_KEY } from './modules/todoModule'

const localStoragePlugin:Plugin<any> = store => {
  store.subscribe((mutation, { todoModule }) => {
    console.log(todoModule.todos)
    if (todoModule) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todoModule.todos))
    }
  })
}

export default [localStoragePlugin]
