import express from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import cors from "cors";

const app = express();

// const PORT=4000;

dotenv.config()
const PORT=process.env.PORT;


app.use(express.json());

const MONGO_URL = process.env.MONGO;
// console.log(process.env)

async function Createconnection() {
  const Client = new MongoClient(MONGO_URL);
  await Client.connect();
  console.log("Mongo connected");
  return Client;
}

export const Client = await Createconnection();
app.use(cors());


app.get("/", function (req, res) {
  res.send("Mentor and Student Assigning with Database Task");
});
//creating mentors
app.post("/mentor",async function(req,res){
    const {mentor_name,mentor_id,mentor_address,mentor_number}=req.body
    
    const mentor_exist  = await Client.db("Mentor_students").collection("Mentors").findOne({mentor_id:mentor_id})
    if(mentor_exist){
        res.status(400).send("mentor already exist")
    }else{
        const adding_mentors= await Client.db("Mentor_students").collection("Mentors").insertOne({mentor_name,mentor_id,mentor_address,mentor_number})
    if(adding_mentors){
        res.status(200).send("mentor added successfully")
    }else{
        res.status(400).send("Can't add mentor something went worng")
    }
    }
})

//creating students
app.post("/students",async function(req,res){
    const {student_name,student_id,student_cls,student_address,student_number}=req.body
    const student_exist  = await Client.db("Mentor_students").collection("Students").findOne({student_id:student_id})
    if(student_exist){
        res.status(400).send("mentor already exist")
    }else{
        const adding_student= await Client.db("Mentor_students").collection("Students").insertOne({student_name,student_id,student_address,student_cls,student_number})
        if(adding_student){
            res.status(200).send("Student added successfully")
        }else{
            res.status(400).send("Can't add student something went worng")
        }
    }
})
//showing all students
app.get('/getstudents',async ()=>{
    const data = await Client.db("Mentor_students").collection("Students").find({}).toArray()
    res.status(200).send(data)
})
//showing all mentors
app.get('/getmentors',async ()=>{
    const data = await Client.db("Mentor_students").collection("Mentors").find({}).toArray()
    res.status(200).send(data)
})
//Assigning students to mentor
app.post("/assign", async ()=>{
    const {mentor_name,mentor_id,student_id,student_name}=req.body
    const mentor_exist  = await Client.db("Mentor_students").collection("Mentors").findOne({mentor_id:mentor_id})
    const student_exist  = await Client.db("Mentor_students").collection("Students").findOne({student_id:student_id})
    if(mentor_exist && student_exist){
        const Assigning = await Client.db("Mentor_students").collection(mentor_name).insertOne({student_exist})
        if(Assigning){
            res.status(200).send("assigned successfully")
        }else{
            res.status(400).send("something went worng can't assign")
        }
    }else{
        res.status(400).send("invalid inputs")
    }
})

// Assigning the mew mentor to students
app.post("/changementor",async ()=>{
    const {old_mentor,student_name,student_id,new_mentorname,new_mentorid}=req.body

   const old_mentor_exist = await Client.db("Mentor_students").collection("Mentors").findOne({mentor_name:old_mentor})
if(old_mentor_exist){
    const student_exist  = await Client.db("Mentor_students").collection("Students").findOne({student_id:student_id})
    if(student_exist){
        const Assigning = await Client.db("Mentor_students").collection(new_mentorname).insertOne({student_exist})
        if(Assigning){
            const deletedata = await Client.db("Mentor_students").collection(old_mentor).deleteOne({student_id})

            res.status(200).send("assigned a new mentor successfully")
        }else{
            res.status(400).send("something went worng can't assign")
        }
    }else{
        res.send("student not exist")
    }

}else{
    res.send("old mentor not exist")
}


})

app.listen(PORT,()=>{console.log(`port is runing in ${PORT}`)})