<template>
    <section>
    <h1>SignUp</h1>
    <div v-if="signingUp">
        <img src="../assets/loading.svg"/>
    </div>
    <div v-if="errorMessage" class="alert alert-danger" role="alert">
        {{this.errorMessage}}
    </div>
    <form @submit.prevent="Signup" v-if="!signingUp">
  <div class="form-group">
    <label for="username">Username</label>
    <input
     v-model="user.username"
     type="text" 
     class="form-control" 
     id="username" 
     aria-describedby="usernameHelp" required>
    <h5 id="usernameHelp" class="form-text text-muted">Username must be longer than 2 characters and shorter than 30.
    Username must only contain alphanumeric characters and underscores.</h5>
  </div>
  <div class="form-row">
  <div class="form-group col-md-6">
    <label for="password">Password</label>
    <input
     v-model="user.password"
     type="password" 
     class="form-control" 
     id="password"
     aria-describedby="passwordHelp" required>
    <h5 id="passwordHelp" class="form-text text-muted">Password must be longer than 6 characters or more.</h5>
  </div>
  <div class="form-group col-md-6">
    <label for="confirmPassword">Password</label>
    <input
     v-model="user.confirmPassword"
     type="password" 
     class="form-control" 
     id="confirmPassword"
     aria-describedby="confirmpasswordHelp" required>
    <h5 id="confirmpasswordHelp" class="form-text text-muted">Please confirm your password.</h5>
  </div>
  </div>
  <button type="submit" class="btn btn-primary">SignUp</button>
</form>
    </section>
</template>

<script>
import joi from "joi";

const SIGNUP_URL = 'http://localhost:5000/auth/signup';

const schema = joi.object().keys({
    username: joi.string().regex(/(^[a-zA-Z0-9_]*$)/).min(2).max(30).required(),
    password: joi.string().min(6).required().trim(),
    confirmPassword: joi.string().min(6).required().trim()
});

export default {
    data:() => ({
        signingUp: false,
        errorMessage: '',
        user: {
            username: '',
            password: '',
            confirmPassword: '',
        },
    }),
    watch: {
        user: {
            handler() {
                this.errorMessage = '';
            },
            deep : true,
        },
    },
    methods: {
        validUser() {
            if(this.user.password != this.user.confirmPassword) {
                this.errorMessage = 'Password must match!'
                return false
            }
            const result = joi.validate(this.user, schema);
            if (result.error === null) {
                return true
            }else {
                if (result.error.message.includes('username')) {
                    this.errorMessage = 'Username is Invalid';
                }else {
                    this.errorMessage = 'password is Invalid';
                }
                return false;
            }
        },
        Signup() {
            this.errorMessage = '';
            if(this.validUser()) {
                const body = {
                    username: this.user.username,
                    password: this.user.password
                };
                this.signingUp = true;
                fetch(SIGNUP_URL, {
                    method: 'POST',
                    body: JSON.stringify(body),
                    headers: {
                        'content-type': 'application/json'
                    }
                }).then((res) => {
                    if (res.ok) {
                        this.signingUp = false;
                        return res.json();
                    }
                    res.json().then((error) => {
                        this.signingUp = false;
                        this.errorMessage = error.message;
                        //throw new Error(error.message);
                    });
                }).then((result) => {
                    localStorage.token = result.token;
                    setTimeout(() => {
                        this.signingUp = false;
                        this.$router.push('/dashboard');
                    }, 1000);
                }).catch((error) => {
                    setTimeout(() => {
                        this.signingUp = false;
                        this.errorMessage = error.message;
                    }, 1000);
                });
            }
        }
    }
    
}
</script>

<style scoped>

</style>