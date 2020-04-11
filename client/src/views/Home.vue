<template>
  <div class="home text-center">
    <div class="jumbotron">
  <h1 class="display-3">Authentication for NeBS</h1>
  <p class="lead">Learning Auth is Fun</p>
  <hr class="my-4">
  <p>Hello Folksksksks</p>
  <p class="lead">
    <router-link class="btn btn-primary btn-lg"
    :to="{name:'Signup'}">
    Sign up</router-link>
  </p>
  <button class="btn btn-info login" @click="changetologin">Sign in </button>
</div>
  </div>
</template>

<script>

export default {
  name: 'Home',
  methods: {
    changetologin() {
            this.$router.push('/login');
        }
  }
}
</script>

<style scoped>
  .login{
    font-weight: 400;
    font-size: 1.3rem;
    padding: 0.5rem 1rem;
    line-height: 1.5;
    border-radius: 0px;
  }
</style>
