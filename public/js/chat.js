const socket=io();

//DOM Elements
const messageForm=document.querySelector('#messageForm');
const formInput=messageForm.querySelector('input');
const formButton=messageForm.querySelector('button');

const locationButton=document.querySelector('#sendLoc');
const messages=document.querySelector('#messages');

const messageTemplate=document.querySelector("#message-template").innerHTML;
const locationTemplate=document.querySelector("#location-message-template").innerHTML;
const sidebarTemplate=document.querySelector("#sidebar-template").innerHTML;

//Add


//const {username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true});
const autoScroll=()=>{
    const newMessage=messages.lastElementChild;

    const newMessageStyle=getComputedStyle(newMessage);//Retrieve CSS for this message
    const newMessageMargin=parseInt(newMessageStyle.marginBottom);
    const newMessageHeight=newMessage.offsetHeight+newMessageMargin;

    const pageHeightVisible=messages.offsetHeight;

    const totalContainerHeight=messages.scrollHeight;

    let scrollOffset=messages.scrollTop;//Amount of distance scrolled from top
    scrollOffset+=pageHeightVisible;//Distance from bottom

    //If we were at the bottom already
    if(Math.round(totalContainerHeight-newMessageHeight)<=Math.round(scrollOffset)){
        messages.scrollTop=totalContainerHeight;//Scroll to the bottom
    }
}

//When This socket receives the message
socket.on("message",(message)=>{
    const html=Mustache.render(messageTemplate,{
        message:message.messageText,
        createdAt:moment(message.createdAt).format('h:mm A'),
        username:message.sentBy
    });
    messages.insertAdjacentHTML('beforeend',html);
    autoScroll();
});
//When the socket recieves the location
socket.on("location",(message)=>{
    const html=Mustache.render(locationTemplate,{
        message:message.messageText,
        createdAt:moment(message.createdAt).format('h:mm A'),
        username:message.sentBy
    });
    messages.insertAdjacentHTML('beforeend',html);
    autoScroll();
});
//Room details event
socket.on('roomDetails',({room,users})=>{
    const html=Mustache.render(sidebarTemplate,{
        room,users
    });
    document.querySelector(".chat__sidebar").innerHTML=html;
});

//Sending Message Form
document.querySelector("#messageForm").addEventListener("submit",(event)=>{
    event.preventDefault();//To prevent full browser refresh

    formButton.setAttribute('disabled','disabled');
    //Disable button for a moment until server fetches it properly

    socket.emit('messageSent',event.target.elements.Message.value,(messageFromServer)=>{
        console.log("Message delivered!");
        formButton.removeAttribute('disabled');
        formInput.value='';
        formInput.focus();
    });
    //Event.target=the form. Access name element "Message", and its value
})

//Sending Location
locationButton.addEventListener("click",()=>{
    if(!navigator.geolocation){
        return alert("Geolocation is not supported by your browser");
    }
    locationButton.setAttribute('disabled','disabled');

    const location=navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit("locationSent",`https://google.com/maps/?q=${position.coords.latitude},${position.coords.longitude}`,(messageFromServer)=>{
            console.log("Message delivered:",messageFromServer);
            locationButton.removeAttribute('disabled');
        });
    })
});

socket.emit('join',{
    username:Qs.parse(location.search,{ignoreQueryPrefix:true}).username,
    room:Qs.parse(location.search,{ignoreQueryPrefix:true}).room
},(message)=>{
    if(message!="" && message!=undefined){
        alert(message);
        location.href='/';
    }
});



/*
socket.on('countUpdated',(countReceived)=>{
    console.log("The count has been updated!");
    console.log(countReceived);
});

document.querySelector('#increment').addEventListener('click',()=>{
    console.log("Clicked");
    socket.emit('increment'); //Calls socket.on('*correct_params*');
});
*/