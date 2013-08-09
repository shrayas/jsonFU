$(function(){

  $.get("data.json",function(json){

    console.log("I/P: " + JSON.stringify(json));
    var flat = parse("",json);
    console.log("FLAT: " + JSON.stringify(flat));
    var unflat = unParse(flat);
    console.log("INFLATED: " + JSON.stringify(unflat));

  });

  function fxn(key,val) {

    var returnObj = {};

    var hasSlash = key.indexOf("/");

    if (hasSlash == -1) {
      returnObj[key]=val;
    }

    else
    {
      var effectiveKey = key.substring(0,key.indexOf("/"));
      var remaining = key.substring(key.indexOf("/")+1);

      var hasMoreKeys = remaining.indexOf("/");
      var intermediate = {}

      if (hasMoreKeys != -1) {
        returnObj[effectiveKey] = fxn(remaining,val);
      }
      else {
       intermediate[remaining] = val;
       returnObj[effectiveKey] = intermediate;
      }
    }

    return returnObj;
  }

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

  function unParse(obj) {

    var returnObj = {};

    var keys = Object.keys(obj);

    for (keyIndex in keys) {

      var key = keys[keyIndex];
      var val = obj[key];

      var iobj = fxn(key,val);

      $.extend(true,returnObj,iobj);

    }

    return returnObj;

  }

});
