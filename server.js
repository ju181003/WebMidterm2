const express = require('express');
const https = require('https');

const app = express()

const port = 3000



app.use(express.json());
app.use(express.urlencoded({ extended:true }));

app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');


app.get('/', (req, res) => {
  // const url = "https://akabab.github.io/superhero-api/api//id/1.json"

  const url = 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/all.json'
  https.get(url, (response)=>{
    let tempJson = ""
    response.on('data', (data)=>{
      tempJson += data
    }).on("end", (data)=>{
      const jsonFile = JSON.parse(tempJson)
      // res.sendFile(__dirname + "/views/index.ejs");
      res.render("index", {superheros :jsonFile})
    })
  })
})

app.get('/superhero/:id', (req, res) => {
  if(req.params.id!="..."){
    const id = req.params.id
    const url = `https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/id/${id}.json`
    https.get(url, (response)=>{
      let tempJson = "" 
      response.on('data', (data)=>{
        tempJson += data
      }).on("end", (data)=>{
        const jsonFile = JSON.parse(tempJson)
        // res.sendFile(__dirname + "/views/index.ejs");
        let nextid= `/superhero/${parseInt(id)+1}`
        let preid= `/superhero/${parseInt(id)-1}`
        if(id=='1'){
          preid= `/superhero/731`
        }
        if(id=='731'){
          nextid= `/superhero/1`
        }
        res.render("info", {
          superhero :jsonFile, 
          nextid: nextid, 
          preid: preid,
          id: id
        })

      })
    }) 
  }else{
    res.end()
  }
  
  // res.sendFile(__dirname + "./index.html");
})


app.get('/search', (req, res) => {
  res.setHeader("Content-Type", "text/html");
  const url = `https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/all.json`;
  https.get(url, (response) => {
      if (response.statusCode == 200) {
          let tempJSON3 = "";
          response.on("data", (data) => {
              tempJSON3 += data;
          }).on("end", (data) => {
              let jsonfile3 = JSON.parse(tempJSON3);
              const c = [];
              jsonfile3.forEach((superhero) => {
                  c.push({
                      id: superhero.id,
                      name: superhero.name,
                      image: superhero.images.md,
                      biography: superhero.biography.fullName,
                      power1: superhero.powerstats.intelligence,
                      power2: superhero.powerstats.strength,
                      power3: superhero.powerstats.speed,
                      power4: superhero.powerstats.durability,
                      power5: superhero.powerstats.power,
                      power6: superhero.powerstats.combat,
                      birth: superhero.biography.placeOfBirth,
                      first: superhero.biography.firstAppearance,
                      aliases: superhero.biography.aliases,
                      gender: superhero.appearance.gender,
                      race: superhero.appearance.race,
                      height: superhero.appearance.height,
                      weight: superhero.appearance.weight,
                      eyeColor: superhero.appearance.eyeColor,
                      hairColor: superhero.appearance.hairColor,
                      affiliation: superhero.connections.groupAffiliation,
                  });
              });
              const name = req.query.name.toLowerCase();
              const matchingHero = c.find((superhero) => superhero.name.toLowerCase() == name);
              if (matchingHero) {
                  const id = matchingHero.id;
                  console.log(id);
                  var preid;
                  var next;
                  if (id === 731) {
                      preid = id - 1;
                      nextid = 1;
                  } else if (id === 1) {
                      preid = 731;
                      nextid = id + 1;
                  } else {
                      preid = id - 1;
                      nextid = id + 1;
                  }
                  res.render('info', { preid, nextid, superhero: matchingHero });
              } else {
                  res.render('error2');
              }
          });
      }
  });
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
