import { createRouter, createWebHistory } from "vue-router";

// Importing Views
import Home from "../views/Home.vue";
import Auth from "../views/Auth.vue";
import Dashboard from "../views/Dashboard.vue";

// Define Routes
const routes = [
  { path: "/", component: Home },
  { path: "/auth", component: Auth },
  { path: "/dashboard", component: Dashboard },
];

// Create Router Instance
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
