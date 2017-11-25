(function() {
  var initializing = false,
      superPattern =  // 関数をシリアライズできるか判定する
        /xyz/.test(function() { xyz; }) ? /\b_super\b/ : /.*/;       //#1

  // この基底クラスを継承する新しいクラスの作成
  Object.subClass = function(properties) {                           //#2
    var _super = this.prototype;

    // 基底クラスを実体化する（ただしインスタンスを作るだけ。
    // initコンストラクタは実行しない）
    initializing = true;                                              //#3
    var proto = new this();                                           //#3
    initializing = false;                                             //#3

    // プロパティ群を新しいプロトタイプにコピーする
    for (var name in properties) {                                    //#4
      // 既存の関数を上書きすることになるか、チェックする
      proto[name] = typeof properties[name] == "function" &&
                    typeof _super[name] == "function" &&
                    superPattern.test(properties[name]) ?
          (function(name, fn) {                                        //#5
            return function() {
              var tmp = this._super;

              // 新しい._super()メソッドを追加する。これも同じメソッドだが
              // スーパークラスに追加される※本文で要確認！※
              this._super = _super[name];

              // このメソッドは一時的に結合する必要があるだけなので、
              // 実行を終えたら削除する
              var ret = fn.apply(this, arguments);
              this._super = tmp;

              return ret;
            };
          })(name, properties[name]) :
          properties[name];
    }

    // ダミーのクラスコンストラクタ
    function Class() {                                                   //#6
      // すべての構築作業は、実際にはinitメソッドの中で行われる
      if (!initializing && this.init)
        this.init.apply(this, arguments);
    }

    // 構築したプロトタイプオブジェクトに記入する
    Class.prototype = proto;                                             //#7

    // コンストラクタとして我々の実装を強制する
    Class.constructor = Class;                                           //#8

    // このクラスを拡張できるようにしておく
    Class.subClass = arguments.callee;                                   //#9

    return Class;
  };
})();
