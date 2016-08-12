/**
 * RespositoryDao
 * @flow
 */
'use strict';

var React = require('react-native');

var {
    AsyncStorage,
} = React;

export var FLAG_STORAGE={flag_popular:'popular',flag_trending:'trending'}

export default function RespositoryDao() {//Singleton pattern
    if (typeof RespositoryDao.instance === 'object') {
        return RespositoryDao.instance;
    }
    RespositoryDao.instance = this;
}
RespositoryDao.prototype.saveRespository = function (flag,key,items, callback) {
    var key=flag+'_'+key;

    AsyncStorage.setItem(key, JSON.stringify(items), callback);
}
RespositoryDao.prototype.removeRespository = function (flag,key) {
    var key=flag+'_'+key;
    AsyncStorage.removeItem(key, (error, result)=> {
        console.log(error);
    });
}
RespositoryDao.prototype.getRespository = function (flag,key) {
    var key=flag+'_'+key;
    return new Promise((resolve, reject)=> {
        AsyncStorage.getItem(key, (error, result)=> {
            if (!error) {
                try {
                    resolve(JSON.parse(result));
                } catch (e) {
                    reject(e);
                    console.error(e);
                }
            } else {
                reject(error);
                console.error(error);
            }
        });
    });
}
// module.exports = RespositoryDao;
