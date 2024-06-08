<template>
    
    <div class="login-view">        
        <Login /> 
    </div>
</template>
<script>
import Login from '../components/Login.vue';

export default {
    name:'LoginView',
    components: {
     Login,
    },

};
</script>
<style scoped>
.login-view{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

</style>