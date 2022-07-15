import express from 'express'
import mongoose from 'mongoose'
import student from './model.js'
import bodyParser from 'body-parser'
import url from 'url'
import path from 'path'
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors'

const app=express()
app.use(bodyParser.urlencoded({ extended: true }));
app.use([
    cors(),
    bodyParser.json({ limit: '30mb', extended: true}),
]);

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000"],
        methods: ['GET','POST','PUT','DELETE']
    }
});

const PORT = process.env.PORT || 5000;

server.listen(PORT,()=>{
    console.log(`Server running at port ${PORT}`);
});

mongoose.connect('mongodb+srv://manjunathsaivamshi:manjunath@cluster0.axpjm.mongodb.net/mydb?retryWrites=true&w=majority',(err)=>{
    if(!err) console.log('Connected to db')
    else console.log(err);
})

app.post('/',async (req,res)=>{
    const rollno=req.body.rollno
    const name=req.body.name
    const dob=req.body.dob
    const address=req.body.address

    const obj=await student.find({},{"rollno":1})
    for(let i=0;i<obj.length;i++){
        if(rollno==obj[i].rollno) return res.send({"success":"already created"});
    }

try{
    const obj=new student({
        "rollno":rollno,
        "name":name,
        "dob":Date(dob),
        "address":address
    })
    obj.save();
    return res.send({"success":"successfull"})
}
catch(err){
    return res.send({"success":err});
}


})
app.get('/',async (req,res)=>{
    const rollno=req.query.rollno
    const obj=await student.find({},{"rollno":1,"name":1,"dob":1,"address":1})
    var obj1=null;
    for(let i=0;i<obj.length;i++){
        if(rollno==obj[i].rollno){
            obj1=obj[i];
        }
    }
    console.log(obj1);
    if(obj1!=null){
        return res.send({
            "name":obj1.name,
            "dob":obj1.dob,
            "address":obj1.address
        })
    }
    else{
        return res.send({"success":"not found"})
    }
    
})
app.put('/',async (req,res)=>{
    const rollno=req.body.rollno
    const name=req.body.name
    const dob=req.body.dob
    const address=req.body.address
    var obj1=null;
    const obj=await student.find({},{"rollno":1})
    for(let i=0;i<obj.length;i++){
        if(rollno==obj[i].rollno){
            obj1=obj[i];
        }
    }
    
    if(obj1!=null){
        if(name!=null) obj1.name=name
        if(dob!=null) obj1.dob=Date(dob)
        if(address!=null) obj1.address=address
            obj1.save();
        return res.send({"success":"updated"})
    }
    else{
        return res.send({"success":"not found"})
    }
    
})
app.delete('/',async (req,res)=>{
    const rollno=req.query.rollno
    const obj=await student.find({},{"rollno":1})
    var obj1=null;
    for(let i=0;i<obj.length;i++){
        if(rollno==obj[i].rollno){
            obj1=obj[i];
        }
    }
    if(obj1!=null){
        await obj1.remove();
        return res.send({"success":"deleted"})
    }
    else{
        return res.send({"success":"not found"})
    }
})