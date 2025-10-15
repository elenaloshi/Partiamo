const express = require('express');
const app =express();
const port =3000;
const cors= require('cors');
const contextPath='/api';
app.set('json spaces', 2);

const routeUtente = require('./routes/routeUtente');
const routeViaggio = require('./routes/routeViaggio');
const routePrenotazione = require('./routes/routePrenotazione');
const routeOperatore = require ('./routes/routeOperatore');
const routeViaggiatore= require ('./routes/routeViaggiatore');
const routeWishlist= require ('./routes/routeWishlist');
const routeWishlist_item= require ('./routes/routeWishlist_item');

app.use(cors({origin:'http://localhost:4200' }));
app.use(express.json());
app.use(express.urlencoded({extended: true}));



app.use((req,res,next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    if (req.body && Object.keys(req.body).length > 0) {
        console.log('Body:', req.body);
    }
    next();
});

app.use(contextPath,routeUtente);
app.use(contextPath,routeViaggio);
app.use(contextPath,routePrenotazione);
app.use(contextPath,routeOperatore);
app.use(contextPath,routeViaggiatore);
app.use(contextPath,routeWishlist);
app.use(contextPath,routeWishlist_item);

  app.use((req, res) => {
    res.status(404).json({ erroreMsg: 'Risorsa non trovata' });
  });
  
app.listen(port,()=>{
    console.log("server in secuzione nella porta:",port);
    
})