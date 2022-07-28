var Sample = (field) => {
    var field = field;
    var setField = (value) => {field = value;}
    var getField = () => {return field;}
    return Object.freeze({setField,getField});
}