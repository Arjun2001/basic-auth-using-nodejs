<template>
<section>
    <h1>Login</h1>
    <div v-if="LoggingIn">
        <img src="../assets/loading.svg"/>
    </div>
    <div v-if="errorMessage" class="alert alert-danger" role="alert">
        {{this.errorMessage}}
    </div>
    <form @submit.prevent="login()" v-if="!LoggingIn">
        <div class="form-group">
            <label for="username">Username</label>
            <input
            v-model="user.username"
            type="text" 
            class="form-control" 
            id="username" 
            aria-describedby="usernameHelp" required>
            <h5 id="usernameHelp" class="form-text text-muted">
            Enter Username to Login</h5>
        </div>
        <div class="form-group">
            <label for="password">Password</label>
            <input
            v-model="user.password"
            type="password" 
            class="form-control" 
            id="password" 
            aria-describedby="passwordHelp" required>
            <h5 id="passwordHelp" class="form-text text-muted">
            Enter password to Login</h5>
        </div>
        <button type="submit" class="btn btn-primary">Login</button>
    </form>
    
</section>
</template>

<script>
import joi from "joi";

const LOGIN_URL = 'auth/login';

const schema = joi.object().keys({
    username: joi.string().regex(/(^[a-zA-Z0-9_]*$)/).min(2).max(30).required(),
    password: joi.string().min(6).required().trim()
});

export default {
    data: () => ({
        errorMessage: '',
        LoggingIn: false,
        user: {
            username: '',
            password: ''
        }
    }),
    methods: {
        login() {
            this.errorMessage = '';
            if(this.validUser()) {
                const body = {
                    username: this.user.username,
                    password: this.user.password,
                };
            this.LoggingIn = true;
            fetch(LOGIN_URL, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(body)
            }).then((res) => {
                    this.LoggingIn = false;
                    if (res.ok) {
                        return res.json();
                    }
                    res.json().then((error) => {
                        this.errorMessage = error.message;
                        throw new Error(error.message);
                    });
                }).then((result) => {
                    localStorage.token = result.token;
                    setTimeout(() => {
                        console.log(result);
                        this.$router.push('/dashboard');
                    }, 3000);
                }).catch((error) => {
                    setTimeout(() => {
                        this.errorMessage = error.message;
                    }, 1000);
                });
            }
        },
        validUser() {
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
        }
    
    }
    
}
</script>

<style scoped>

</style>