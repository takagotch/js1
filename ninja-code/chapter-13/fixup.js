function fixEvent(event) {

  function returnTrue() { return true; }
  function returnFalse() { return false; }

  if (!event || !event.stopPropagation) {
    var old = event || window.event;

    // 値を変更できるように古いオブジェクトのクローンを作る
    event = {};

    for (var prop in old) {
      event[prop] = old[prop];
    }

    // この要素でイベントが発生した
    if (!event.target) {
      event.target = event.srcElement || document;
    }

    // イベントに関連する他の要素の扱い
    event.relatedTarget = event.fromElement === event.target ?
        event.toElement :
        event.fromElement;

    // ブラウザのデフォルトアクションを停止する
    event.preventDefault = function () {
      event.returnValue = false;
      event.isDefaultPrevented = returnTrue;
    };

    event.isDefaultPrevented = returnFalse;

    // イベントのバブリングを止める
    event.stopPropagation = function () {
      event.cancelBubble = true;
      event.isPropagationStopped = returnTrue;
    };

    event.isPropagationStopped = returnFalse;

    // イベントのバブリングと他のハンドラの実行を止める
    event.stopImmediatePropagation = function () {
      this.isImmediatePropagationStopped = returnTrue;
      this.stopPropagation();
    };

    event.isImmediatePropagationStopped = returnFalse;

    // マウス位置の扱い
    if (event.clientX != null) {
      var doc = document.documentElement, body = document.body;

      event.pageX = event.clientX +
          (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
          (doc && doc.clientLeft || body && body.clientLeft || 0);
      event.pageY = event.clientY +
          (doc && doc.scrollTop || body && body.scrollTop || 0) -
          (doc && doc.clientTop || body && body.clientTop || 0);
    }

    // キー押下の扱い
    event.which = event.charCode || event.keyCode;

    // マウスクリックのボタンを修正
    // 0 == left; 1 == middle; 2 == right
    if (event.button != null) {
      event.button = (event.button & 1 ? 0 :
          (event.button & 4 ? 1 :
              (event.button & 2 ? 2 : 0)));
    }
  }

  return event;

}
