import axios from'axios';

//axios for caaling the end point 

//get for fetching the details 
export function get(baseUrl,url){
    return axios.get(`${baseUrl}${url}`)
    .then(onSuccess)
    .catch(onError);
}

//post for entering the details
export function post(baseUrl,url,body){
    console.log(body);
    return save(baseUrl,url,body,'post')
}

export function save(baseUrl,url,body,method){
    return axios({
        method:method,
        url:`${baseUrl}${url}`,
        data:body,
    })
    .then(onSuccess)
    .catch(onError);
}

function onSuccess(response){
    // 204 means The server has fulfilled the request but does not need to return 
    if(response.status !==204){
        return response.data;
    }
    throw new Error('No Response Content');
}

function onError(error){
    //when Software caused connection abort 
    if(error&& error.code==='ECONNABORATED'){
        throw new Error({
            status:504,
            data:{
                variant:'error',
                message:'Server Timeout while Api Operation.'
            },
        });
    }
    const returnedError =error && error.response;
    throw returnedError;
}