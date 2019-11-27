function isEmptyObject(obj) {
    return Object.keys(obj).length === 0;
}

function hasAllMembersEmpty(object) {
    for (let key in object) {
        if (object.hasOwnProperty(key)) {
            if (object[key].length > 0)
                return false;
        }
    }
    return true;
}

function createQueryString(data){
    let queryString = "?";
    if (!isEmptyObject(data)){
        for (let key in data) {
            if (data.hasOwnProperty(key) && data[key]) {
                queryString += key + "=" + data[key] + "&"
            }
        }
    }
    return queryString;
}

export default {isEmptyObject, createQueryString, hasAllMembersEmpty};