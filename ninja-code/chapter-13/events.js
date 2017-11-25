(function() {

  var nextGuid = 1;

  this.addEvent = function (elem, type, fn) {

    var data = getData(elem);                           //#1

    if (!data.handlers) data.handlers = {};             //#2

    if (!data.handlers[type])                           //#3
      data.handlers[type] = [];                         //#3

    if (!fn.guid) fn.guid = nextGuid++;                 //#4

    data.handlers[type].push(fn);                       //#5

    if (!data.dispatcher) {                             //#6
      data.disabled = false;
      data.dispatcher = function (event) {

        if (data.disabled) return;
        event = fixEvent(event);

        var handlers = data.handlers[event.type];       //#7
        if (handlers) {
          for (var n = 0; n < handlers.length; n++) {   //#7
            handlers[n].call(elem, event);              //#7
          }
        }
      };
    }

    if (data.handlers[type].length == 1) {              //#8
      if (document.addEventListener) {
        elem.addEventListener(type, data.dispatcher, false);
      }
      else if (document.attachEvent) {
        elem.attachEvent("on" + type, data.dispatcher);
      }
    }

  };

  function tidyUp(elem, type) {

    function isEmpty(object) {                          //#1
      for (var prop in object) {
        return false;
      }
      return true;
    }

    var data = getData(elem);

    if (data.handlers[type].length === 0) {             //#2

      delete data.handlers[type];

      if (document.removeEventListener) {
        elem.removeEventListener(type, data.dispatcher, false);
      }
      else if (document.detachEvent) {
        elem.detachEvent("on" + type, data.dispatcher);
      }
    }

    if (isEmpty(data.handlers)) {                        //#3 どの型も残っていないか？
      delete data.handlers;
      delete data.dispatcher;
    }

    if (isEmpty(data)) {                                 //#4 すべてのハンドラが消えたか？
      removeData(elem);
    }
  }

  this.removeEvent = function (elem, type, fn) {       //#1 可変長引数リスト

    var data = getData(elem);                          //#2 データをフェッチ

    if (!data.handlers) return;                        //#3 ハンドラがない！

    var removeType = function(t){                      //#4 ユーティリティ関数
      data.handlers[t] = [];
      tidyUp(elem,t);
    };

    if (!type) {                                       //#5 すべての型のハンドラを削除
      for (var t in data.handlers) removeType(t);
      return;
    }

    var handlers = data.handlers[type];                //#6 この型のハンドラ群を取得
    if (!handlers) return;

    if (!fn) {                                         //#7 この型の全ハンドラを削除
      removeType(type);
      return;
    }

    if (fn.guid) {                                     //#8 結合済み関数を1つ削除？
      for (var n = 0; n < handlers.length; n++) {
        if (handlers[n].guid === fn.guid) {
          handlers.splice(n--, 1);
        }
      }
    }
    tidyUp(elem, type);

  };

  this.proxy = function (context, fn) {
    if (!fn.guid) {
      fn.guid = nextGuid++;
    }
    var ret = function () {
      return fn.apply(context, arguments);
    };
    ret.guid = fn.guid;
    return ret;
  };

})();
