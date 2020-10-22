<template>
  <li class="todo" :class="{ completed: todo.done, editing: editing }">
    <div class="view">
      <input class="toggle"
        type="checkbox"
        :checked="todo.done"
        @change="toggleTodo(todo)">
      <label v-text="todo.text" @dblclick="editing = true"></label>
      <button class="destroy" @click="removeTodo(todo)"></button>
    </div>
    <input class="edit"
      v-show="editing"
      v-focus="editing"
      :value="todo.text"
      @keyup.enter="doneEdit"
      @keyup.esc="cancelEdit"
      @blur="doneEdit">
  </li>
</template>

<script lang="ts">
import { VNode } from 'vue'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { DirectiveBinding } from 'vue/types/options'
import { todoModule, TodoItemData } from '../store/modules/todoModule'

@Component({
  directives: {
    focus(el:HTMLElement, binding:DirectiveBinding, vNode:VNode) {
      if (binding.value) {
        vNode.context?.$nextTick(() => {
          el.focus()
        })
      }
    }
  },
})
export default class TodoItem extends Vue {
  private editing = false

  @Prop({
    required: true,
    type: Object,
  })
  private todo!: TodoItemData

  private editTodo(payload:{ todo: TodoItemData, text: string }) {
    todoModule.actions.editTodo(payload)
  }

  private toggleTodo(todo:TodoItemData) {
    todoModule.actions.toggleTodo(todo)
  }

  private removeTodo(todo:TodoItemData) {
    todoModule.actions.removeTodo(todo)
  }

  private doneEdit (e:InputEvent) {
    const text = (e.target as HTMLInputElement).value.trim()
    const { todo } = this
    if (!text) {
      this.removeTodo(todo)
    } else if (this.editing) {
      this.editTodo({
        todo,
        text
      })
  
      this.editing = false
    }
  }

  private cancelEdit (e:InputEvent) {
    (e.target as HTMLInputElement).value = this.todo.text
    this.editing = false
  }
}
</script>
