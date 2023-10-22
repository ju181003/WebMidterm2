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


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
