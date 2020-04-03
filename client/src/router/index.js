import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Signup from '../views/Signup.vue'
import login from '../views/Login.vue'
import dashboard from '../views/Dashboard.vue'

Vue.use(VueRouter)

function loggedInredirectDashboard(to, from, next) {
  if(localStorage.token) {
    next('/dashboard');
  }else {
    next();
  }
};

function isLoggedIn(to, from, next) {
  if(localStorage.token) {
    next();
  }else {
    next('/login');
  }
}

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup,
    beforeEnter: loggedInredirectDashboard,
  },
  {
    path: '/login',
    name: 'login',
    component: login,
    beforeEnter: loggedInredirectDashboard,
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: dashboard,
    beforeEnter: isLoggedIn,
  }
]

const router = new VueRouter({
  routes
})

export default router
