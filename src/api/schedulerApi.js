import{
    post,
    get,
} from './apiHelpers';

import{
    SCHEDULER_HOST,
} from './baseUrls';

//api call for adding student details
export function apiAddContent(studentDetails){
    return post(SCHEDULER_HOST,"/insert",studentDetails);
}

//api call for fetching student details
export function apiGetDetails(){
    return get(SCHEDULER_HOST,"/students");
}