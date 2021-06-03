/**
 *
 * 封装sqlite 函数 for uni-app
 * created by YOUJUN
 *
 */

import {errorCaptured} from './youjun_tools';

export default {

    //数据库是否为打开状态
    isOpenDB : function(name, path){
        let isOpen = plus.sqlite.isOpenDatabase({
            name,
            path
        });
        console.log('是否已经打开数据库',isOpen);

        return isOpen
    },


    closeDB(name){
        return new Promise((resolve, reject)=>{
            plus.sqlite.closeDatabase({
                name,
                success : (result) =>{
                    console.log('关闭数据库成功');
                    resolve(result);
                },
                fail : (err) => {
                    console.error('关闭数据库失败');
                    reject(err);
                }
            })
        });

    },

    //打开数据库
    openComDB(name, path){
        return new Promise((resolve, reject)=>{
            console.log('plus',plus.sqlite);
            plus.sqlite.openDatabase({
                name,
                path,
                success (e){
                    resolve(e);
                },
                fail (e){
                    reject(e);
                }
            })
        })
    },

    executeSQL(name, sql){
        return new Promise((resolve, reject) => {
            plus.sqlite.selectSql({
                name,
                sql,
                success(e){
                    resolve(e);
                },
                fail(e){
                    reject(e);
                }
            })
        })
    },

    async isTableExit(baseName, tableName){
        let sql = `SELECT count(*) AS count FROM sqlite_master WHERE type="table" AND name = "${tableName}"`;
        let results = await this.executeSQL(baseName, sql);
        if(results[0].count && results[0].count > 0){
            return true;
        }

        return false;
    },

    createTableCarSQL : `
        CREATE TABLE IF NOT EXISTS car(
            ID INT PRIMARY KEY,
            CAR_INDEX TEXT NOT NULL,
            CAR_OWNER_NAME TEXT NOT NULL,
            CAR_OWNER_PHONE INTEGER,
            CAR_OWNER_CODE TEXT,
            FUEL_NAME TEXT,
            CAR_NO TEXT NOT NULL,
            CAR_KIND TEXT,
            ESTIMATE_AMOUNT REAL,
            IN_DATE TEXT
        )
    `,

    //创建表
    async createTable(db, tableName, sql){

        let spawnSql = `CREATE TABLE IF NOT EXISTS ${tableName}(${sql})`;

        let [err, res] = await errorCaptured(this.executeSQL, db, spawnSql);
        console.log('err',err,'res',res);

        if(err){
            console.error('创建 car 表失败', err);
        }
        if(res){
            console.log('创建 car 表成功', res);
        }

    },

    //删除表
    async delTable(db, tableName){
        let isExit = await this.isTableExit(db, tableName);
        if(isExit){
            try{
                let result = this.executeSQL(db, `DROP TABLE ${tableName};`);
                console.log(`删除${tableName}表成功`,result);
            }catch (e) {
                console.log(`删除${tableName}表失败`,e);
            }

        }else{
            console.log(tableName,'表不存在');
        }
    },

    //插入数据
    async insertData(db, tableName, data){
        let column = ['ID'];
        let values = ['null'];
        for(let item in data){
            column.push(item);
            let type = typeof data[item];
            console.log('type',type);
            if(type == 'number'){
                values.push(`${data[item]}`);
            }else{
                values.push(`'${data[item]}'`);
            }

        }
        column = column.join(',');
        values = values.join(',');

        let sql = `INSERT INTO ${tableName} (${column}) VALUES (${values});`;

        console.log('sql==>',sql);

        let [err, res] = await errorCaptured(this.executeSQL, db, sql);
        if(err){
            console.log('插入失败',err);
        }
        if(res){
            console.log('插入成功');
        }
        let result = res || [];
        return result;
    },


    //查询数据
    async selectData(db, tableName, limit){
        let sql = '';
        if(!limit || limit === '*'){
            sql = `SELECT * FROM ${tableName}`;
        }else{
            sql = `SELECT * FROM ${tableName} WHERE ${limit}`;
        }

        let [err, res] = await errorCaptured(this.executeSQL, db, sql);

        let status = 1;
        let msg = "查询成功!";
        let data = res;
        if(err){
            status = 0;
            msg = '查询失败!';
            data = err;
        }

        return {
            status,
            msg,
            data
        }

    }

}









