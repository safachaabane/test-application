const express = require("express");
var cors = require('cors')
const PORT = process.env.PORT || 3001;
const app = express();
//use cors to allow cross origin resource sharing
app.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true,
    })
  );

app.use(express.json())

app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
  });

//   add data
  app.post('/data', function (req, res) {
    var newData = req.body
    console.log(newData);
    if(req.body.MontantAchat>50000){
        var fraisAchat=req.body.MontantAchat*10/100
        console.log(fraisAchat)
    }
    const MontantEmprunterBrut=req.body.MontantAchat -req.body.FondsPropres +fraisAchat
    const FraisHypotheque=MontantEmprunterBrut*2/100
    const MontantEmprunterNet=MontantEmprunterBrut+FraisHypotheque
    const TauxInteretMensuel = ((Math.pow((1+req.body.TauxAnnuel/100),(1/12))-1)*100).toFixed(3);
    const Mensualite = (MontantEmprunterNet*(TauxInteretMensuel/100)*Math.pow(1+(TauxInteretMensuel/100),req.body.DureeCredit)/(Math.pow(((TauxInteretMensuel/100)+1),240)-1)).toFixed(2)
    console.log(MontantEmprunterBrut, FraisHypotheque, MontantEmprunterNet, TauxInteretMensuel,Mensualite)
        var TabAmortissement=[]
    var TabAmortissementparmois=[]
    SoldeDebut=MontantEmprunterNet
    for(let i=0;i<req.body.DureeCredit;i++){
        if(i!=0){
       
           SoldeDebut=SoldeFin
        }
        var Interet=(SoldeDebut*TauxInteretMensuel/100).toFixed(2)
        var CapitalRembourse=(Mensualite-Interet).toFixed(2)
       var SoldeFin= (SoldeDebut-CapitalRembourse).toFixed(2);
       TabAmortissementparmois.push(SoldeDebut, Mensualite, Interet, CapitalRembourse,SoldeFin)
       TabAmortissement.push([SoldeDebut, Mensualite, Interet, CapitalRembourse,SoldeFin])
    }

res.send({"TableauAmortissement":TabAmortissement, "MontantEmprunterbrut":MontantEmprunterBrut,"MontantEmprunterNet":MontantEmprunterNet,"Mensualite":Mensualite});
})

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});