function triggerEvent(elem, event) {

  var elemData = getData(elem),                 //要素データと親への参照を取得
      parent = elem.parentNode || elem.ownerDocument;

  if (typeof event === "string") {              //文字列で渡されたら、その型のイベントを作成
    event = { type:event, target:elem };
  }
  event = fixEvent(event);                      //イベントを正規化

  if (elemData.dispatcher) {                    //#1 渡されたイベントにディスパッチャがあれば、
    elemData.dispatcher.call(elem, event);      //#1 設定されているハンドラ群を実行する
  }

  if (parent && !event.isPropagationStopped()) {        //#2 明示的に止められていない限り
                                                        //#2 DOMツリーでのバブリングを行うため
    triggerEvent(parent, event);                        //#2 この関数を再帰的に呼び出す
  }

  else if (!parent && !event.isDefaultPrevented()) {    //#3 要素がDOMのルートで、デフォルト
                                                        //#3 アクションが禁止されていなければ
                                                        //#3 デフォルトアクションをトリガする
    var targetData = getData(event.target);

    if (event.target[event.type]) {             //#4 この型のイベントにデフォルトアクションがあれば

      targetData.disabled = true;       //#5 すでにハンドラを実行したので、このターゲットでの
                                        //#5 イベントのディスパッチを、一時的に無効にする

      event.target[event.type]();               //#6 デフォルトアクションを実行

      targetData.disabled = false;              //ディスパッチを有効に戻す

    }

  }
}
