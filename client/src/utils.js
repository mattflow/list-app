function deepCopy(obj) {
  if (obj.constructor === Array) {
    return obj.map(deepCopy);
  } else if (typeof obj === 'object') {
    const copy = {};
    for (var key in obj) {
      copy[key] = deepCopy(obj[key]);
    }
    return copy;
  } else {
    return obj;
  }
}

function putData(url, data) {
  return postPutData('PUT', url, data);
}

function postData(url, data) {
  return postPutData('POST', url, data);
}

function postPutData(method, url, data) {
  // Default options are marked with *
    return fetch(url, {
        method: method, // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, same-origin, *omit
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            // "Content-Type": "application/x-www-form-urlencoded",
        },
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // no-referrer, *client
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    })
    .then(response => response.json()); // parses response to JSON
}

function isDefined(anything) {
  return anything !== void 0;
}

module.exports = {
  deepCopy: deepCopy,
  putData: putData,
  postData: postData,
  isDefined: isDefined,
};