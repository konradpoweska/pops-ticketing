<template>
  <b-container fluid="sm" class="login-form">
    <p class="logo">POPS1920</p>
    <b-form-group label="Identifiant">
      <b-form-input v-model="username"></b-form-input>
    </b-form-group>
    <b-form-group label="Mot de passe">
      <b-form-input v-model="password" type="password"></b-form-input>
    </b-form-group>
    <b-button variant="success" v-on:click="connect" class="btnConnect">Se connecter</b-button>
    <p class="mdpOublie" v-on:click="resetmdp">Mot de passe oublié?</p>
  
  </b-container>
</template>

<script>
import store from '~/store';

export default {
  data() {
    return {
      username: '' ,
      password:'',
    }
  }, 
  methods:{
    connect: function (event){
      //console.log("Je me connecte via mes identifiants :)!")
      fetch('/api/login/',
      {
        method: "POST",
        body: JSON.stringify({
          username: this.username,
          password: this.password
        }), 
        headers:{
          "Content-Type": "application/json"
        }
      })
      .then(res => {
        if(res.status === 200) return res.json();
        if(res.status === 403) throw Error("Bad credentials.");
        if(res.status === 500) throw Error("Server error.");
      })
      .then(res => {
        store.user = res.userData;
        store.token = res.token;
      })
      .catch(err => {/* afficher err.message quelque part */})
            //Verifi status de rep --> 2
      },
    resetmdp: function (event){
      console.log("J'ai oublié mon mdp!")
    }
  }
}
</script>

<style scoped>
.login-form{
  background-color:white;
  font-size: 1rem;
  border: 1px solid #fff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0px 0px 10px 0px #000;
  width: 400px;
}
.logo {
  font-size: 2rem;
  font-family: 'Courier New', Courier, monospace;
  font-weight: bold;
  line-height: 1.0;
  padding: 0;
}
.logo span {
  font-size: 1.4rem;
}
.mdpOublie {
  color:blue;
}
.mdpOublie:hover {
  text-decoration: underline;
}
.btnConnect{
  position: relative;
}
</style>