<template>
    <div class="login">
        <h2>Registration</h2>
        <form action="" @submit.prevent="createUser">
            <div>
                <label for="username">Nombre Usuario:</label>
                <input
                type="text"
                id="username"
                v-model="username"
                @input="validateUsername"
                />
                <span v-if="usernameError">{{usernameError}}</span>
            </div>
            <div>
                <label for="password">Contraseña:</label>
                <input
                type="password"
                id="password"
                v-model="password"
                />
            </div>
            <button type="submit" :disabled="!isFormValid">Ingresar</button>
        </form>
    </div>
</template>
<script>
export default{
    data(){
        return{
            username:'',
            password:'',
            usernameError:'',
            isFormValid: false,
        };

    },
    computed:{

    },
    methods:{
        validateUsername(){
            const alphanumericKey= /^[a-z0-9]+$/i;
            if(!alphanumericKey.test(this.username)) {
                this.usernameError='El usuario debe ser alfanumerico';
                this.isFormValid=false;
            }
            else{
                this.usernameError='';
                this.isFormValid=true;

            }
        }
            
    }
}
</script>