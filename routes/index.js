const express=require('express');
const router =express.Router();


const {ChatMsg,ChatUniq,UserMsg} =require('../models/chatmsg');

//Get All Msg

router.get('/api/msgs',(req,res)=>{
    ChatMsg.find({},(err,data)=>{
        if(!err){
           // res.send(data);
            res.send('Hi,I am responded');
        }else{
            console.log(err);
        }
    })
});

router.get('/api/chat',(req,res)=>{
    ChatUniq.find({},(err,data)=>{
        if(!err){
            res.send(data);
        }else{
            console.log(err);
        }
    })
});
const qurey={$or:[{"uniqeCID":"CD"},{"uniqeCID":"DC"}]};

router.get('/api/userchat',(req,res)=>{
    UserMsg.find(qurey, (err,data)=>{
        if(!err){
            res.send(data);
            console.log(data.length);
        }else{
            console.log(err);
        }
        
    })
});

//save chat msg
router.post('/api/msg/save',(req,res)=>{
    const msg = new UserMsg({
        uniqeCID :req.body.uniqeCID,
        sender:req.body.sender,
        receiver:req.body.receiver,
        msg:req.body.msg,
        time:req.body.time,
        seen:req.body.seen,
        delivered:req.body.delivered
    });
    msg.save((err,data)=>{
        res.status(200).json({code:200,msg:"msg saved succesfuly",msgData:data});
    })
});


router.post('/api/msg/add',(req,res)=>{
    const msg = new ChatMsg({
        name:req.body.name,
        email:req.body.email,
        age:req.body.age
    });
    msg.save((err,data)=>{
        res.status(200).json({code:200,msg:"msg save succesfuly",msgData:data});
    })
});


module.exports =router;