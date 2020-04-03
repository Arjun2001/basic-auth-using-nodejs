<template>
    <div>
        <h1>Dashboard</h1>
        <h1>Hello, {{user}}</h1>
        <button @click="logout" class="btn btn-primary">Logout</button>
    </div>
</template>

<script>
const API_URL = 'http://localhost:5000/';
export default {
    data() {
        return{
            user: null
        }
    },
    methods: {
        logout() {
            localStorage.removeItem('token');
            this.$router.push('/login');
        }
    },
    mounted() {
        fetch(API_URL, {
            headers: {
                authorization: `Bearer ${localStorage.token}`,
            },
        }).then(res => res.json())
        .then((result) => {
            if(result.user) {
                this.user = result.user.username;
                console.log(this.user);
            }else{
                this.logout();
            }
        });
    },
};
</script>

<style scoped>

</style>