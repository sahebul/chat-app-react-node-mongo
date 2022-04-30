const mongoose=require('mongoose');
const mongoDBConnect= async()=>{
    try{
        const conn=await mongoose.connect(process.env.MONGO_CONFIG,{
            useNewUrlParser:true,
            useUnifiedTopology:true
        })
        console.log('Mongo db connected'+ conn.connection.host);
    }catch(error){
        console.log("MongoError"+error.message);
        process.exit();

    }
}
module.exports =mongoDBConnect;