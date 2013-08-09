$(function(){

  $.get("data.json",function(json){

    console.log(json);

    console.log(parse("",json));

  });

  function parse (prefix, obj) {

    if (prefix != "")
      prefix = prefix + "/";

    var returnObj = {};

    var keys = Object.keys(obj);

    for (keyIndex in keys) {

      var key = keys[keyIndex];
      var val = obj[key];

      if (typeof val == "object")
        jQuery.extend(returnObj,parse(prefix + key,val));
      else 
        returnObj[prefix + key] = val;
    }

    return returnObj;

  }

});
