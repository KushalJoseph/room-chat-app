const users=[];

const addUser=({id,username,room})=>{
    id=id.toString().trim();
    username=username.trim();
    let flag=-1;
    if(!id || !username){
        flag=0;
    }
    users.forEach((user)=>{
        if(user.username==username){
            flag=1;
            console.log("Yeah");
        }
    })
    if(flag==0){
        throw new Error("Username or Id is invalid or not provided!");
    }else if(flag==1){
        throw new Error("This username is already taken!");
    }
    const user={id,username,room};
    users.push(user);
    return user;
}

const removeUser=(id)=>{
    let userToReturn;
    users.forEach((user)=>{
        if(user.id==id){
            userToReturn=user;
            users.splice(users.indexOf(user),1);
        }
    });
    if(!userToReturn){
        throw new Error("User not found");
    }
    return userToReturn;
}

const getUser=(id)=>{
    let userToReturn;
    users.forEach((user)=>{
        if(user.id==id){
            userToReturn=user;
        }
    });
    if(!userToReturn){
        throw new Error("User not found!");
    }
    return userToReturn;
}

//Return inside foreach sends return value of the foreach function!

const getUsersFromRoom=(room)=>{
    const returnedUsers=[];
    users.forEach((user)=>{
        if(user.room==room){
            returnedUsers.push(user);
        }
    })
    return returnedUsers;
}

module.exports={
    addUser,removeUser,getUser,getUsersFromRoom,users
}

/*addUser({
    id:"23",username:"Hey",room:"1"
});
addUser({
    id:"35",username:"Heya",room:"1"
})
console.log("Users array: ",users);
console.log("Get User",getUser('23'));
console.log("Remove user",removeUser("26"));
console.log("Users array: ",users);*/

