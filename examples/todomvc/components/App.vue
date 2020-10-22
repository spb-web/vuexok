<style src="todomvc-app-css/index.css"></style>

<template>
  <section class="todoapp">
    <!-- header -->
    <header class="header">
      <h1>todos</h1>
      <input class="new-todo"
        autofocus
        autocomplete="off"
        placeholder="What needs to be done?"
        @keyup.enter="addTodo">
    </header>
    <!-- main section -->
    <section class="main" v-show="todos.length">
      <input class="toggle-all" id="toggle-all"
        type="checkbox"
        :checked="allChecked"
        @change="toggleAll(!allChecked)">
      <label for="toggle-all"></label>
      <ul class="todo-list">
        <TodoItem
          v-for="(todo, index) in filteredTodos"
          :key="index"
          :todo="todo"
        />
      </ul>
    </section>
    <!-- footer -->
    <footer class="footer" v-show="todos.length">
      <span class="todo-count">
        <strong>{{ remaining }}</strong>
        {{ remaining | pluralize('item') }} left
      </span>
      <ul class="filters">
        <li 
          v-for="(val, key) in filters"
          :key="key"
        >
          <a :href="'#/' + key"
            :class="{ selected: visibility === key }"
            @click="visibility = key">{{ key | capitalize }}</a>
        </li>
      </ul>
      <button class="clear-completed"
        v-show="todos.length > remaining"
        @click="clearCompleted">
        Clear completed
      </button>
    </footer>
  </section>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import TodoItem from './TodoItem.vue'
import { todoModule, TodoItemData } from '../store/modules/todoModule'

type test = number

const filters = {
  all: (todos:TodoItemData[]) => todos,
  active: (todos:TodoItemData[]) => todos.filter(todo => !todo.done),
  completed: (todos:TodoItemData[]) => todos.filter(todo => todo.done),
}

@Component({
  components: { TodoItem },
  filters: {
    pluralize: (n:number, w:string) => n === 1 ? w : (w + 's'),
    capitalize: (s:string) => s.charAt(0).toUpperCase() + s.slice(1)
  }
})
export default class App extends Vue {
  private visibility:keyof typeof filters = 'all'
  private filters = filters

  private get todos () {
    return todoModule.getters.todo
  }
  private get allChecked () {
    return this.todos.every(todo => todo.done)
  }
  private get filteredTodos () {
    return filters[this.visibility](this.todos)
  }
  private get remaining () {
    return this.todos.filter(todo => !todo.done).length
  }
  private toggleAll(done:boolean) {
    todoModule.actions.toggleAll(done)
  }
  private clearCompleted() {
    todoModule.actions.clearCompleted()
  }
  addTodo (e:InputEvent) {
    const text = (e.target as HTMLInputElement).value
  
    if (text.trim()) {
      todoModule.actions.addTodo(text)
    }

    (e.target as HTMLInputElement).value = ''
  }
}
</script>
