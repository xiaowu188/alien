/*!
 * data-traveller.js
 * @author ydr.me
 * 2014-09-14 17:26
 */


define(function (require, exports, module) {
    /**
     * @module util/data
     */

    'use strict';

    var udf;
    var canListTypeArr = 'array object nodelist htmlcollection'.split(' ');
    //var RE_URL = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/;
    var RE_URL = /^https?:\/\/(\w+\.)+[a-z]{2,5}(\/|\/[\w#!:.?+=&%@!\-\/]+)?$/i;
    var RE_EMAIL = /^\w+[-+.\w]*@([\w-]+\.)+[a-z]{2,5}$/i;


    /**
     * 判断数据类型，结果全部为小写<br>
     * 原始数据类型：boolean、number、string、undefined、symbol
     * @param {*} object 任何对象
     * @returns {string}
     *
     * @example
     * data.type();
     * // => "undefined"
     *
     * data.type(null);
     * // => "null"
     *
     * data.type(1);
     * // => "number"
     *
     * data.type("1");
     * // => "string"
     *
     * data.type(!1);
     * // => "boolean"
     *
     * data.type({});
     * // => "object"
     *
     * data.type([]);
     * // => "array"
     *
     * data.type(/./);
     * // => "regexp"
     *
     * data.type(window);
     * // => "window"
     *
     * data.type(document);
     * // => "document"
     *
     * data.type(document);
     * // => "document"
     *
     * data.type(NaN);
     * // => "nan"
     *
     * data.type(Infinity);
     * // => "number"
     *
     * data.type(function(){});
     * // => "function"
     *
     * data.type(new Image);
     * // => "element"
     *
     * data.type(new Date);
     * // => "date"
     *
     * data.type(document.links);
     * // => "htmlcollection"
     *
     * data.type(document.body.dataset);
     * // => "domstringmap"
     *
     * data.type(document.body.classList);
     * // => "domtokenlist"
     *
     * data.type(document.body.childNodes);
     * // => "nodelist"
     *
     * data.type(document.createAttribute('abc'));
     * // => "attr"
     *
     * data.type(document.createComment('abc'));
     * // => "comment"
     *
     * data.type(new Event('abc'));
     * // => "event"
     *
     * data.type(document.createExpression());
     * // => "xpathexpression"
     *
     * data.type(document.createRange());
     * // => "range"
     *
     * data.type(document.createTextNode(''));
     * // => "text"
     */
    exports.type = function (object) {
        if (typeof window !== 'undefined' && object === window) {
            return 'window';
        } else if (typeof global !== 'undefined' && object === global) {
            return 'global';
        } else if (typeof document !== 'undefined' && object === document) {
            return 'document';
        } else if (object === udf) {
            return 'undefined';
        } else if (object === null) {
            return 'null';
        }

        var ret = Object.prototype.toString.call(object).match(/\s(.*)\]/)[1].toLowerCase();

        if (/element/.test(ret)) {
            return 'element';
        } else if (isNaN(object) && ret === 'number') {
            return 'nan';
        }

        return ret;
    };


    /**
     * 格式化数字，如果是非数字则返回默认值
     * @param {*} obj 待格式化对象
     * @param {*} [dft] 非数字时的默认值
     * @returns {*}
     */
    exports.parseFloat = function (obj, dft) {
        obj = parseFloat(obj);

        return isNaN(obj) ? dft : obj;
    };


    /**
     * 遍历元素
     * @param {Array/Object} list  数组、可枚举对象
     * @param {Function(this:data, key, val)} callback  回调，返回false时停止遍历
     * @param {*} [context] 上下文
     *
     * @example
     * // 与 jQuery.each 一样
     * // 返回 false 时将退出当前遍历
     * data.each(list, function(key, val){});
     */
    exports.each = function (list, callback, context) {
        var i;
        var j;

        // 数组 或 类似数组
        if (list && list.length !== udf) {
            for (i = 0, j = this.parseInt(list.length, 0); i < j; i++) {
                context = context || list[i];
                if (callback.call(context, i, list[i]) === false) {
                    break;
                }
            }
        }
        // 纯对象
        else if (list !== null && list !== udf) {
            for (i in list) {
                if (list.hasOwnProperty(i)) {
                    context = context || list[i];
                    if (callback.call(context, i, list[i]) === false) {
                        break;
                    }
                }
            }
        }
    };


    /**
     * 格式化数字，如果是非数字则返回默认值
     * @param {*} obj 待格式化对象
     * @param {*} [dft] 非数字时的默认值
     * @returns {*}
     */
    exports.parseInt = function (obj, dft) {
        obj = parseInt(obj);

        return isNaN(obj) ? dft : obj;
    };


    /**
     * 扩展静态对象
     * @param {Boolean|Object} [isExtendDeep] 是否深度扩展，可省略，默认false
     * @param {Object}  [source] 源对象
     * @param {...Object}  [target] 目标对象，可以是多个
     * @returns {*}
     *
     * @example
     * // 使用方法与 jQuery.extend 一样
     * var o1 = {a: 1};
     * var o2 = {b: 2};
     * var o3 = data.extend(true, o1, o2);
     * // => {a: 1, b: 2}
     * o1 === o3
     * // => true
     *
     * // 如果不想污染原始对象，可以传递一个空对象作为容器
     * var o1 = {a: 1};
     * var o2 = {b: 2};
     * var o3 = data.extend(true, {}, o1, o2);
     * // => {a: 1, b: 2}
     * o1 === o3
     * // => fale
     */
    exports.extend = function (isExtendDeep, source, target) {
        var args = arguments;
        var firstArgIsBoolean = typeof(args[0]) === 'boolean';
        var current = firstArgIsBoolean ? 1 : 0;
        var length = args.length;
        var i;
        var obj;
        var type;

        isExtendDeep = firstArgIsBoolean && args[0] === true;
        source = args[current++];

        for (; current < length; current++) {
            obj = args[current];
            for (i in obj) {
                if (this.hasOwnProperty(obj, i) && obj[i] !== undefined) {
                    type = this.type(obj[i]);
                    if (type === 'object' && isExtendDeep) {
                        source[i] = {};
                        this.extend.call(this, isExtendDeep, source[i], obj[i]);
                    } else if (type === 'array' && isExtendDeep) {
                        source[i] = [];
                        this.extend.call(this, isExtendDeep, source[i], obj[i]);
                    } else {
                        source[i] = obj[i];
                    }
                }
            }
        }

        return source;
    };


    /**
     * 转换对象为一个纯数组，只要对象有length属性即可
     * @param {Object} [data] 对象
     * @param {Boolean} [isConvertWhole] 是否转换整个对象为数组中的第0个元素，当该对象无length属性时，默认false
     * @returns {Array}
     *
     * @example
     * var o = {0:"foo", 1:"bar", length: 2}
     * data.toArray(o);
     * // => ["foo", "bar"]
     *
     * var a1 = [1, 2, 3];
     * // 转换后的数组是之前的副本
     * var a2 = data.toArray(a1);
     * // => [1, 2, 3]
     * a2 === a1;
     * // => false
     */
    exports.toArray = function (obj, isConvertWhole) {
        var ret = [];
        var i = 0;
        var j;
        var objType = this.type(obj);

        if (canListTypeArr.indexOf(objType) > -1 && this.type(obj.length) === 'number' && obj.length >= 0) {
            for (j = obj.length; i < j; i++) {
                ret.push(obj[i]);
            }
        } else if (obj && isConvertWhole) {
            ret.push(obj);
        }

        return ret;
    };


    /**
     * 判断一个对象是否有属于自身的方法、属性，而不是原型链方法、属性以及其他继承来的方法、属性
     * @param obj {Object} 判断对象
     * @param prop {String} 方法、属性名称
     * @returns {Boolean}
     *
     * @example
     * var o = {a: 1};
     * data.hasOwnProperty(o, 'a');
     * // => true
     */
    exports.hasOwnProperty = function (obj, prop) {
        return Object.prototype.hasOwnProperty.call(obj, prop);
    };


    /**
     * 对象1级比较，找出相同和不同的键
     * @param obj1 {Object|Array}
     * @param obj2 {Object|Array}
     * @returns {Object}
     *
     * @example
     * data.compare({a:1,b:2,c:3}, {a:1,d:4});
     * // =>
     * // {
     * //    same: ["a"],
     * //    only: [
     * //       ["b", "c"],
     * //       ["d"]
     * //    ],
     * //    different: ["b", "c", "d"]
     * // }
     */
    exports.compare = function (obj1, obj2) {
        var obj1Type = this.type(obj1);
        var obj2Type = this.type(obj2);
        var obj1Only = [];
        var obj2Only = [];
        var same = [];

        // 类型不同
        if (obj1Type !== obj2Type) {
            return null;
        }

        // 对象
        if (obj1Type === 'object' || obj1Type === 'array') {
            this.each(obj1, function (key, val) {
                if (obj2[key] !== val) {
                    obj1Only.push(key);
                } else {
                    same.push(key);
                }
            });

            this.each(obj2, function (key, val) {
                if (obj1[key] !== val) {
                    obj2Only.push(key);
                }
            });

            return {
                same: same,
                only: [
                    obj1Only,
                    obj2Only
                ],
                different: obj1Only.concat(obj2Only)
            };
        } else {
            return null;
        }
    };


    /**
     * 修正正则字符串
     * @param regExpString
     * @returns {string}
     *
     * @example
     * data.fixRegExp('/');
     * // => '\/'
     */
    exports.fixRegExp = function (regExpString) {
        return regExpString.replace(/[.*+?^=!:${}()|[\]/\\]/g, '\\$&');
    };


    /**
     * 计算字节长度
     * @param string {String} 原始字符串
     * @param [doubleLength=2] {Number} 双字节长度，默认为2
     * @returns {number}
     *
     * @example
     * data.bytes('我123');
     * // => 5
     */
    exports.bytes = function (string, doubleLength) {
        string += '';
        doubleLength = this.parseInt(doubleLength, 2);

        var i = 0,
            j = string.length,
            k = 0,
            c;

        for (; i < j; i++) {
            c = string.charCodeAt(i);
            k += (c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f) ? 1 : doubleLength;
        }

        return k;
    };


    /**
     * 判断是否为 URL 格式
     * @param string
     * @returns {boolean}
     *
     * @example
     * data.isURL('http://123.com/123/456/?a=3#00');
     * // => true
     */
    exports.isURL = function (string) {
        return RE_URL.test(string + '');
    };


    /**
     * 判断是否为 email 格式
     * @param string
     * @returns {boolean}
     *
     * @example
     * data.isEmail('abc@def.com');
     * // => true
     */
    exports.isEmail = function (string) {
        return RE_EMAIL.test(string + '');
    };


});