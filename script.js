$(function(){

  $.get("data.json",function(json){

    console.log("I/P: " + JSON.stringify(json));
    var flat = deflate("",json);
    console.log("DEFLATED: " + JSON.stringify(flat));
    var unflat = inflate(flat);
    console.log("INFLATED: " + JSON.stringify(unflat));

  });


  /**
   * Function to deflate a given JSON.
   * Recursive function.
   * @param prefix 
   *          What to be prefixed while deflating
   * @param obj
   *          The object to deflate
   * @returns the deflated JSON
   */
  function deflate (prefix, obj) {

    // If there is an existing prefix
    if (prefix != "")
      // Suffix the prefix with a "/"
      prefix = prefix + "/";

    // Object to be returned
    var returnObj = {};

    // Get the list of keys within the object
    var keys = Object.keys(obj);

    // Iterate through all the keys
    for (keyIndex in keys) {

      // Pick up the key and the value
      var key = keys[keyIndex];
      var val = obj[key];

      // If the value is an object
      if (typeof val == "object")
        /*
         * Deflate the object using the current key as a prefix
         * After the deflating, it would return an object which is to be appended to the main return object
         */
        jQuery.extend(returnObj,deflate(prefix + key,val));
      else 
        // If the value isn't an object, just throw it inside the main return object
        returnObj[prefix + key] = val;
    }

    // return the object
    return returnObj;

  }

  /**
   * Function to inflate a given deflated JSON
   *
   * @param obj
   *          The deflated object to be inflated
   * @returns the inflated json
   */
  function inflate(obj) {

    // The object to be returned
    var returnObj = {};

    // Get the list of keys within the object
    var keys = Object.keys(obj);

    // iterate through all the keys
    for (keyIndex in keys) {

      // Pick up the respective Key and the Value
      var key = keys[keyIndex];
      var val = obj[key];

      /*
       * Pass the key and the value to a function that 
       * returns an inflated object, if the key is "b/c" and
       * the value is "x" then a nested object is created with 
       * key "c" and value "x" and assigned to the object "b"
       * and returned.
       */
      var coreInflatedObject = getObject(key,val);

      /*
       * append the inflated object, and its associated 
       * nested objects to the main object
       */
      $.extend(true,returnObj,coreInflatedObject);

    }

    // Return the object
    return returnObj;

  }

  /**
   * Function to get an object (nested, if required) represented by a key 
   * to a value. Recursive function
   *
   * @param key
   *          The key to get the object for
   * @param val
   *          The value to be associated with the generated key
   * @returns The object represented by the key-value pairing
   */
  function getObject(key,val) {

    // The object to be returned
    var returnObj = {};

    // Check if the key has a slash
    var hasSlash = key.indexOf("/");

    // If there isn't a slash
    if (hasSlash == -1) 
      // There are no nested keys
      // put the value in the key
      returnObj[key]=val;

    // If there is a slash
    else
    {

      // Pick up everything from index 0 till the first "/" is found
      // This becomes the key of the parent object
      var effectiveKey = key.substring(0,key.indexOf("/"));

      // Pick up the remaining stuff from the key
      var remaining = key.substring(key.indexOf("/")+1);

      // Get the index of a "/" in the remaining part of the key
      var hasMoreKeys = remaining.indexOf("/");

      // Create an intermediate object
      var intermediate = {}

      // If the remaining part of the key HAS a "/"
      if (hasMoreKeys != -1) 
        // Call the function again with the remaining key and the value
        returnObj[effectiveKey] = getObject(remaining,val);

      // If there isn't anything else
      else {
        // Assign the value to the intermediate object
       intermediate[remaining] = val;

       // Assign the intermediate object to the parent
       returnObj[effectiveKey] = intermediate;
      }
    }

    // Return the object
    return returnObj;
  }

});
