const app = new Vue({
  el: "#app",
  data: {
      origins: [],
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
              computed: false
          });
          this.inputOrigin = "";
      },
      computeDistances: function(){
          if(this.origins.length===0 || this.destination.length === 0){
              alert("Must have atleast one origin and non-empty destination")
          }
          const link = this.getMapsLink()
          axios.get(link)
              .then((response) => {
                  const data = response.data;
                  data.result.forEach((comp, i) => {
                      if(comp.status === "OK"){
                          this.origins[i].color = 'green';
                          this.origins[i].distance_text = comp.distance.text;
                          this.origins[i].distance_value = comp.distance.value;
                      } else{
                          this.origins[i].color = 'red';
                      }
                      this.origins[i].computed = true;
                  })
              });
      },
      getMapsLink: function(){
          const base_link = '/compute-distance';
          const origins = this.origins.map((o) => o.name).join('|');
          const destination = this.destination;
          return `${base_link}?origins=${origins}&destination=${destination}`;
      }
  },
});
