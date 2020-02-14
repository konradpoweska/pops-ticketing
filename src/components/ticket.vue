<!-- PROCHAINES ETAPES --> 
 
 <template>
  <div>
    <b-container fluid="xl">
      <!-- PARTIE ID TICKET/BAR DE PROGRESSION-->
      <b-row  style="background-color:lightblue;">
            <p>ID: #{{ id }} Créé le 12-02-2020 par Arnaud LAUPERATEUR</p>
            <div class="progress">
               <div class="progress-bar" role="progressbar" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100" style="width:70%">
                70%
               </div>
            </div>
            <p>1 tâche réalisée sur 2</p>
      </b-row>
       <!-- PARTIE CLIENT/DEMANDEUR -->
       <div class="row">   
          <div class="col-sm-6" style="background-color:lavender;">
              <label for="Client">Client:</label>
              <b-row>
                <b-col> 
                  <b-form-select v-model="selected" :options="clients"></b-form-select>
                </b-col>
                <b-col> 
                  <b-form-checkbox>Prioritaire</b-form-checkbox>
                </b-col>
              </b-row>
              
              <label for="Requester">Demandeur:</label>
              <b-row>
                <b-col cols="6"> 
                  <b-form-select v-model="selected" :options="requesters"></b-form-select>
                </b-col>
                <b-col cols="3">
                  <b-button>Ajouter<b-button>
                </b-col>

              </b-row>
                <p>Téléphone</p>
                <p>Email</p>
                <p>Address</p>
            
          </div>
          <!-- PARTIE INTERVENTION/COMPETENCES TECHNICIEN -->
          <div class="col-sm-6" style="background-color:lightyellow;">
          <!--<div class="col-sm-6" style="background-color:brown;"> -->
              <b-row>
                <b-col> 
                  <label for="ticketName">Nom du ticket:</label>
                  <input type="ticketName" class="form-control" id="ticketName">
                </b-col>
                
                <b-col>
                  <b-row>
                    <label for="ticketType">Type du ticket:</label>
                  </b-row> 
                  <b-row>
                    <input type="radio" id="question" value="Question" v-model="picked">
                    <label for="question">Question</label>
                    <input type="radio" id="intervention" value="Intervention" v-model="picked">
                    <label for="intervention">Intervention</label>
                  </b-row>
                </b-col>
              </b-row>

              <b-row>
                <b-col cols="6"> 
                  <label for="category">Catégorie:</label>
                  <b-form-select v-model="selected" :options="categories"></b-form-select>
                </b-col>
              </b-row>

              <b-row>
                <b-col cols="6"> 
                  <label for="description">Description:</label>
                  <input type="description" class="form-control" id="description">
                </b-col>
              </b-row>

              <b-row>
                <b-col cols="6"> 
                  <label for="address">Adresse de l'intervention:</label>
                  <input type="address" class="form-control" id="address">
                </b-col>
              </b-row>

              <b-row>
                <b-col cols="6"> 
                  <label for="skill">Compétences:</label>
                  <b-form-select v-model="selected" :options="skills"></b-form-select>
                </b-col>
                <b-col cols="6"> 
                  <label for="technician">Technicien:</label>
                  <b-form-select v-model="selected" :options="technicians"></b-form-select>
                </b-col>
              </b-row>

              <b-row>
                <b-col cols="3"> 
                  <label for="plannedDuration">Durée prévue:</label>
                  <input type="plannedDuration" class="form-control" id="plannedDuration">
                </b-col>
                <b-col cols="3"> 
                  <label for="actualDuration">Durée réelle:</label>
                  <input type="actualDuration" class="form-control" id="actualDuration">
                </b-col>
                <b-col cols="3"> 
                  <label for="actualDuration">Commencer:</label>
                  <b-button type="startTimer" id="startTimer">Commencer</b-button>
                </b-col>
              </b-row>
              <br>
              <!-- TRANSITION SE PASSE ICI-->
          </div>
      </div>
      <!-- PARTIE TABLEAU DES SOUS TICKETS-->
      <div class="row-sm-12" style="background-color:lightpink;">
        <p>#{{id}} - Ticket Parent</p>
        <b-row>
          <b-col cols="8">
            <b-table striped hover :items="items" :fields="fields"></b-table>
          </b-col>
          
        </b-row>


      </div>
    </b-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      content: null,
      clients: [
          { value: null, text: 'Please select an option' },
          { value: 'a', text: '1 - Chauffe Rapide' },
          { value: 'b', text: '2 - Fenêtre Secure' },
        ],
      requesters: [
          { value: null, text: 'Please select an option' },
          { value: 'a', text: '1 - M Dupont' },
          { value: 'b', text: '2 - Mme Durand' },
        ],
      categories: [
          { value: null, text: 'Please select an option' },
          { value: 'a', text: '1 - Electricité' },
          { value: 'b', text: '2 - Chauffage' },
        ],
      skills: [
          { value: null, text: 'Please select an option' },
          { value: 'a', text: '1 - Electricien' },
          { value: 'b', text: '2 - Chauffagiste' },
        ],
      technicians: [
          { value: null, text: 'Please select an option' },
          { value: 'a', text: '1 - Romain Letechnicien' },
          { value: 'b', text: '2 - Jafar Lecafard' },
        ],
      items: [
          { isActive: true, age: 40, first_name: 'Dickerson', last_name: 'Macdonald' },
          { isActive: false, age: 21, first_name: 'Larsen', last_name: 'Shaw' },
          { isActive: false, age: 89, first_name: 'Geneva', last_name: 'Wilson' },
          { isActive: true, age: 38, first_name: 'Jami', last_name: 'Carney' }
      ],
    }
  },
  props: ['id'],
  mounted() {
    fetch('/api/tickets/'+this.id)
      .then(res => res.json())
      .then(obj => {
        this.content = obj;
        this.$emit('title-update', `#${this.id} - ${obj.title}`);
      });
  }
}
</script>

<style>
/*.code {
  font-family: Consolas, monospace;
  font-size: 9pt;
  padding: .5rem;
  background: #eee;
  white-space: pre-wrap;
}*/
</style>
