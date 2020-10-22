import {createModule} from '../../../../dist/vuexok'
import store from '../index'

export type TodoItemData = {
  done: boolean,
  text: string,
}

export const STORAGE_KEY = 'STORAGE_KEY_TODO_VUEXOK'

// for testing
if (navigator.userAgent.indexOf('PhantomJS') > -1) {
  window.localStorage.clear()
}

export const todoModule = createModule(store, 'todoModule', {
  state: {
    todos: JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]') as TodoItemData[]
  },
  actions: {
    addTodo (injectee, text) {
      todoModule.mutations.addTodo({
        text,
        done: false
      })
    },
  
    removeTodo (injectee, todo:TodoItemData) {
      todoModule.mutations.removeTodo(todo)
    },
  
    toggleTodo (injectee, todo:TodoItemData) {
      todoModule.mutations.editTodo({ todo, done: !todo.done })
    },
  
    editTodo (injectee, payload: { todo:TodoItemData, text:string }) {
      todoModule.mutations.editTodo(payload)
    },
  
    toggleAll ({ state }, done:boolean) {
      state.todos.forEach((todo) => {
        todoModule.mutations.editTodo({ todo, done })
      })
    },
  
    clearCompleted ({ state }) {
      state.todos
        .filter(todo => todo.done)
        .forEach(todo => {
          todoModule.mutations.removeTodo(todo)
        })
    }
  },
  mutations: {
    addTodo (state, todo:TodoItemData) {
      state.todos.push(todo)
    },
  
    removeTodo (state, todo:TodoItemData) {
      state.todos.splice(state.todos.indexOf(todo), 1)
    },
  
    editTodo (state, payload: { todo:TodoItemData, text?:string, done?:boolean }) {
      const index = state.todos.indexOf(payload.todo)
      const { 
        text = payload.todo.text,
        done = payload.todo.done,
      } = payload
  
      state.todos.splice(index, 1, {
        ...payload.todo,
        text,
        done
      })
    }
  },
  getters: {
    todo: (state) => state.todos
  }
})
