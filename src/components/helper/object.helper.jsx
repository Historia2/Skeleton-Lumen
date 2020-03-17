export const setAll = (obj, val) => {
    Object.keys(obj).forEach(function (index) {
        obj[index] = val
    });
    return obj;
}

export const translateOptions = (raw, origin, schemas, callback) => {
    let data = { ...raw }
    const keys = Object.keys(data);
    // eslint-disable-next-line array-callback-return
    keys.map(key => {
        let schema = schemas.find(e => e.name === key)
        const option = schema ? schema.option : key;

        if (typeof origin[option] === "undefined") {
          data[key] = data[key];
          // data[key] = ;
        } else {
          data[key] = typeof origin[option].find(o => o.key === data[key]) === "undefined" ? "" : origin[option].find(o => o.key === data[key]).value;
        }

    });
    callback(data);
}

export const decodeOptions = (raw, origin, schemas, callback) => {
    let data = { ...raw }
    const keys = Object.keys(data);
    // eslint-disable-next-line array-callback-return
    keys.map(key => {
        let schema = schemas.find(e => e.name === key)
        const option = schema ? schema.option : key;
        data[key] = origin[option].find(o => o.value === data[key]).key;
    });
    callback(data);
}

export const getNestedObject = (nestedObj, pathArr) => {
    return pathArr.reduce((obj, key) =>
        (obj && obj[key] !== 'undefined') ? obj[key] : undefined, nestedObj);
}
