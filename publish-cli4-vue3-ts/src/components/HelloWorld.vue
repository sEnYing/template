<template>
  <section id="app" class="todoapp">
    <header class="header">
      <h1>todos</h1>
      <input
        class="new-todo"
        placeholder="What needs to be done?"
        autocomplete="off"
        autofocus
        v-model="input"
        @keyup.enter="addTodoMethod"
      />
    </header>
    <!-- <section class="main" v-show="count"> -->
    <section class="main" v-show="count">
      <input
        id="toggle-all"
        class="toggle-all"
        v-model="allDone"
        type="checkbox"
      />
      <label for="toggle-all">Mark all as complete</label>
      <ul class="todo-list">
        <li
          v-for="todo in filteredTodos"
          :key="todo"
          :class="{ editing: todo === editingTodo, completed: todo.completed }"
        >
          <div class="view">
            <input class="toggle" type="checkbox" v-model="todo.completed" />
            <label @dblclick="editTodo(todo)">{{ todo.text }}</label>
            <button class="destroy" @click="removeTodoMethod(todo)"></button>
          </div>
          <input
            class="edit"
            type="text"
            v-editing-focus="todo === editingTodo"
            v-model="todo.text"
            @keyup.enter="doneEdit(todo)"
            @blur="doneEdit(todo)"
            @keyup.esc="cancelEdit(todo)"
          />
        </li>
      </ul>
    </section>
    <footer class="footer" v-show="count">
      <span class="todo-count">
        <strong>{{ remainingCount }}</strong>
        {{ remainingCount > 1 ? "items" : "item" }} left
      </span>
      <ul class="filters">
        <li><a href="#/all">All</a></li>
        <li><a href="#/active">Active</a></li>
        <li><a href="#/completed">Completed</a></li>
      </ul>
      <button
        class="clear-completed"
        @click="removeCompleted"
        v-show="count > remainingCount"
      >
        Clear completed
      </button>
    </footer>
  </section>
  <footer class="info">
    <p>Double-click to edit a todo</p>
    <!-- Remove the below line ↓ -->
    <p>Template by <a href="http://sindresorhus.com">Sindre Sorhus</a></p>
    <!-- Change this out with your name and url ↓ -->
    <p>Created by <a href="https://www.lagou.com">教瘦</a></p>
    <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
  </footer>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  onUnmounted,
  ref,
  getCurrentInstance,
} from "vue";
import { useRoute, useRouter } from "vue-router";
const addTodo = (todos: any) => {
  var input = ref("");
  const addTodoMethod = () => {
    const text = input.value && input.value.trim();
    if (text.length === 0) return;
    todos.value.unshift({
      text,
      completed: false,
    });
    input.value = "";
  };
  return {
    input,
    addTodoMethod,
  };
};
const removeTodo = (todos: any) => {
  const removeTodoMethod = (todo: any) => {
    const index = todos.indexOf(todo);
    todos.splice(index, 1);
  };
  return {
    removeTodoMethod,
  };
};
const useFilter = (todos: any) => {
  const allDone = computed({
    get() {
      return !todos.value.filter((item: any) => !item.completed).length;
    },
    set(value) {
      todos.value.map((item: any) => {
        item.completed = value;
      });
    },
  });
  const filter: any = {
    all: (list: object[]) => list,
    active: (list: object[]) => list.filter((todo: any) => !todo.completed),
    completed: (list: object[]) => list.filter((todo: any) => todo.completed),
  };
  const type = ref("all");
  const filteredTodos = computed(() => filter[type.value](todos.value));
  const onHashChange = () => {
    const hash = window.location.hash.replace("#/", "");
    if (filter[hash]) {
      type.value = hash;
    } else {
      type.value = "all";
      window.location.hash = "";
    }
  };
  const remainingCount = computed(() => filter.active(todos.value).length);
  onMounted(() => {
    window.addEventListener("hashchange", onHashChange);
    onHashChange();
  });
  onUnmounted(() => {
    window.removeEventListener("hashchange", onHashChange);
  });
  return {
    allDone,
    filteredTodos,
    remainingCount,
  };
};
export default defineComponent({
  name: "HelloWorld",
  props: {
    msg: String,
  },
  setup() {
    const todos: any = ref([]);
    const that: any = getCurrentInstance();
    const $router = useRouter();
    const $route = useRoute();
    console.log(that);
    console.log($router);
    console.log($route);

    return {
      ...addTodo(todos),
      ...removeTodo(todos),
      ...useFilter(todos),
      todos,
    };
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
