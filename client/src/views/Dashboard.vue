<template>
    <section>
        <h1>Dashboard</h1>
        <h1>Hello, {{user}}!!</h1>
        <button @click="logout" class="btn btn-primary">Logout</button>
        <br>
        <br>
        <button @click="showForm=!showForm" class="btn btn-info">Toggle form</button>
        <form v-if="showForm" @submit.prevent="addNote()">
            <div class="form-group">
                <label for="title">TITLE</label>
                <input type="text" class="form-control" id="title" v-model="newNote.title" required>
            </div>
            <div class="form-group">
                <label for="note">Note</label>
                <textarea class="form-control" id="note" rows="3" placeholder="Enter your note" v-model="newNote.note" required></textarea>
            </div>
            <button type="submit" class="btn btn-success">Add Note</button>
        </form>
        <section class="row mt-3">
            <div class="col-4" v-for="note in notes" :key="note._id">
            <div class="card border-info mb-3">
                <div class="card-header">{{note.body.title}}</div>
                <div class="card-body">
                    <h4 class="card-title"></h4>
                    <p class="card-text" v-html="renderMarkDown(note.body.note)"></p>
                </div>
                </div>
            </div>
        </section>
    </section>
</template>

<script>
import MarkdownIt from 'markdown-it';
import MDemoji from 'markdown-it-emoji'

const md = new MarkdownIt();
md.use(MDemoji);

const API_URL = 'http://localhost:5000/';   //has to change in production

export default {
    data() {
        return{
            user: null,
            showForm : false,
            newNote: {
                title: '',
                note: ''
            },
            notes: [],
        }
    },
    methods: {
        renderMarkDown(note) {
            return md.render(note);
        },
        logout() {
            localStorage.removeItem('token');
            this.$router.push('/login');
        },
        addNote() {
            fetch(`api/v1/notes`, {
                method: 'POST',
                body: JSON.stringify(this.newNote),
                headers: {
                    'content-type': 'application/json',
                    authorization: `Bearer ${localStorage.token}`,
                },
            }).then(res => res.json())
            .then((note) => {
                this.notes.push(note);
                console.log(note); 
                this.newNote = {
                    title: '',
                    note: ''
                };
                this.showForm = false;
            })
        },
        getNotes() {
            fetch(`api/v1/notes`, {
                headers: {
                    authorization: `Bearer ${localStorage.token}`
                },
            }).then(res => res.json())
            .then((notes) => {
                this.notes = notes;
            });
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
                this.getNotes();
            }else{
                this.logout();
            }
        });
    },
};
</script>

<style scoped>
.card{
    height:90%;
}
.card-text img{
    width: 100%;
}
</style>