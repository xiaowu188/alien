/*!
 * 本地存储
 * @author ydr.me
 * @create 2015-02-02 15:17
 */


define(function (require, exports, module) {
    /**
     * @module core/navigator/storage
     * @requires util/allocation
     * @requires util/dato
     */
    'use strict';

    var ls = window.localStorage;
    var allocation = require('./../../util/allocation.js');
    var typeis = require('./../../util/typeis.js');
    var dato = require('./../../util/dato.js');
    var gs = function () {
        return allocation.getset({
            get: function (key) {
                return ls.getItem(key);
            },
            set: function (key, val) {
                ls.setItem(key, val);
            }
        }, arguments);
    };


    /**
     * 获取本地存储值
     * @param key {String|Number|Array} 键或者键数组
     */
    exports.get = function (key/*arguments*/) {
        key = arguments.length > 1 ? dato.toArray(arguments) : key;

        return gs(key);
    };


    /**
     * 设置本地存储值
     * @param key {String|Number|Object} 键或者键值对
     * @param [val] {String} 值
     */
    exports.set = function (key, val) {
        gs.apply(window, arguments);
    };


    /**
     * 本地存储长度
     * @returns {number}
     */
    exports.length = ls.length;


    /**
     * 移除本地存储
     * @param [key] {String|Number|Array} 键或者键数组
     */
    exports.remove = function (key) {
        if (key === undefined) {
            return ls.clear();
        }

        key = typeis.array(key) ? key : [key];

        key.forEach(function (ik) {
            ls.removeItem(ik);
        });
    };
});