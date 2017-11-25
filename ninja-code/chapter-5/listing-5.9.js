Function.prototype.bind = function(){                                     //#1
  var fn = this, args = Array.prototype.slice.call(arguments),
    object = args.shift();

  return function(){
    return fn.apply(object,
      args.concat(Array.prototype.slice.call(arguments)));
  };
};

var myObject = {};
function myFunction(){
  return this == myObject;
}

assert( !myFunction(), "まだコンテクストは設定されていない" );

var aFunction = myFunction.bind(myObject);
assert( aFunction(), "コンテクストは正しく設定された" );
