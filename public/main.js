Vue.component('box-component', {
  props:['name'],
  template:`
    <div class="box">
      <div class="columns">
        <div class="column is-four-fifths">
          <p><slot name="name"></slot></p>
        </div>
        <div class="column">
          <p><slot name="distance"></slot></p>
        </div>
        <div class="column">
          <a class="delete" @click='deleted'></a>
        </div>
      </div>
    </div>
  `,
  methods: {
    deleted: function(){
      this.$emit('deleted', this.name);
    }
  },
});

const app = new Vue({
  el: "#app",
  data: {
      origins: [],
      computed: false,
      inputOrigin: "",
      destination: ""
  },
  methods:{
      addNewOrigin: function(){
          if(!this.inputOrigin) return;
          this.origins.push({
              name: this.inputOrigin,
              color: "",
              distance_value: null,
              distance_text: null,
          });
          this.inputOrigin = "";
      },
      computeDistances: function(){
          if(this.origins.length===0 || this.destination.length === 0){
              alert("Must have atleast one origin and non-empty destination");
              return;
          }
          this.computed = false;
          const link = this.getMapsLink();
          axios.get(link)
              .then((response) => {
                  const data = response.data;
                  if(data.error !== null){
                    alert('Something went wrong...try again later');
                    return;
                  }
                  this.computed = true;
                  data.result.forEach((comp, i) => {
                      if(comp.status === "OK"){
                          this.origins[i].color = 'green';
                          this.origins[i].distance_text = comp.distance.text;
                          this.origins[i].distance_value = comp.distance.value;
                      } else{
                          this.origins[i].color = 'red';
                      }
                  });
              });
      },
      getMapsLink: function(){
          const base_link = '/compute-distance';
          const origins = this.origins.map((o) => o.name).join('|');
          const destination = this.destination;
          return `${base_link}?origins=${origins}&destination=${destination}`;
      },
      deleteOrigin: function(name){
        const names = this.origins.map(o => o.name);
        const index = names.indexOf(name);
        if(index === -1){
          return;
        } 
        this.origins.splice(index, 1);

      }

  },
  computed:{
    orderedOrigins(){
      if(this.computed){
        return _.orderBy(this.origins, 'distance_value', 'asc');
      } else{
        return this.origins;
      }
    }
  },
});
