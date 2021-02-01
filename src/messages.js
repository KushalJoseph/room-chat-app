const generateMessage=(messageText,sentBy)=>{
    return {
        messageText,
        createdAt:new Date().getTime(),
        sentBy
    }
}

//To export multiple objects
module.exports={
    generateMessage
}