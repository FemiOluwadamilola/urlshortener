require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dns = require('dns');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const url = require('./model/urlModel');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL;
mongoose.connect(MONGO_URL,
  {
   useNewUrlParser:true,
   useUnifiedTopology:true
  })
.then(() => console.log('DB connected....'))
.catch((err) => console.log(err));

app.use(cors());

app.use(bodyparser.urlencoded({extended:false}));
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', (req,res) => {
  const urlParser = req.body.url;
  const hostname = urlParser.replace(/http[s]?\:\/\//, '').replace(/\/(.+)?/, '');

 dns.lookup(hostname, (err, addresses) => {
   if(err) throw err;

   if(!addresses){
     res.json({error_msg:'Invalid URl'})
   }else{
     const newUrl = new url({
       url:urlParser
     })
   
     newUrl.save((err,result) => {
       if(err) throw err;
       console.log(result);
       res.json({
         original_url:result.url,
         short_url:result.id
       })
     })
   }
  })
})

app.get('/api/shorturl/:id', (req,res) => {
  const id = req.params.id;
  url.findOne({id}, (err, result) => {
    if(err) throw err;
    if(!result){
      res.json({error_msg:'Invalid URL'})
    }else{
       res.redirect(result.id);
    }
  })
})


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
