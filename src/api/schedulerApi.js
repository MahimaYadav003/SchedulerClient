import{
    post,
    // put,
    get,
    // deleteRequest,
} from './apiHelpers';

import{
    SCHEDULER_HOST,
} from './baseUrls';

export function apiAddContent(studentDetails){
    return post(SCHEDULER_HOST,"/insert",studentDetails);
}

export function apiGetDetails(){
    return get(SCHEDULER_HOST,"/students");
}


// export function apiGetStreamList(){
//     return get(SCHEDULER_HOST,'/report/getdropdownDetails');
// }

// export function apiGetTemplateList(streamName){
//     return get(SCHEDULER_HOST,`/email-template/fetch/${streamName}`);
// }



// export function apiDeleteTemplate(name){
//     return deleteRequest(SCHEDULER_HOST,`/email-template/delete/${name}`);
// }

// export function apiUpdateTemplateContent(name,emailTemplate){
//     return put(SCHEDULER_HOST,`/email-template/update/${name}`,emailTemplate);
// }