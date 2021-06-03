/**
 * 实用工具函数
 *  created by YOUJUN
 *
 */


/**
 *
 *
 * @param item 判断item类型
 * @param type
 * @returns {*|boolean}
 */

export function isTypeOf (item, type){
    const map = {
        array: 'Array',
        object: 'Object',
        function: 'Function',
        string: 'String',
        null: 'Null',
        undefined: 'Undefined',
        boolean: 'Boolean',
        number: 'Number'
    };

    let stringType = Object.prototype.toString.call(item).slice(8, -1);
    return map[type] && stringType === map[type];
}


/**
 *
 * @param target   被拷贝子对象
 * @param source   继承父对象
 * @param overwrite     是否覆盖子对象已有属性
 * @param isdeep    是否深度继承
 * @returns {any}
 *
 */

export function extend(target = {}, source ={}, overwrite = true, isdeep = true) {

    for(let key in source){
        if(isdeep && typeof source[key] === 'object'){
            if((target.hasOwnProperty(key) && overwrite) || !target.hasOwnProperty(key)){
                target[key] = isTypeOf(source[key], 'array') ? [] : {};
                extend(target[key], source[key]);
            }
        }

        if(!isdeep || (isdeep && !(typeof source[key] === 'object'))){
            if((target.hasOwnProperty(key) && overwrite) || !target.hasOwnProperty(key)){
                target[key] = source[key];
            }
        }
    }

    return target;
}


/**
 * 数组去重
 *
 * @param targetArr
 * @returns {Array}
 */

export function delSameItemOf(targetArr) {
    return [...new Set(targetArr)];
}

export function delSameItemOf2(targetArr) {
    let arr = [];

    for(let item of arr){
        if(arr.indexOf(item) === -1){
            arr.push(item);
        }
    }

    return  arr;
}

/**
 *处理对象的数组，取得相同的属性值组成新数组并返回
 *
 * @param arr
 * @param props
 * @returns {*}  不改变数组，返回新数组
 */

export function groupBy(arr, props) {
    return arr.reduce((groups, item) => {
        let value = item[props];
        groups[value] = groups[value] || [];
        groups[value].push(item);
        return groups;
    },{})
}



/*---防抖与节流---*/
/*
* 防止指定函数多次调用。当一直触发指定函数时，触发间隔小于指定时间，
* 防抖方法下调用一次;
* 节流方法下每隔一定时间调用一次;
*/
/**
 * 防抖(debounce)
 * 所谓防抖，就是指触发事件后在 n 秒内函数只能执行一次，如果在 n 秒内又触发了事件，则会重新计算函数执行时间。
 *
 * @param func 需要进行防抖处理的函数
 * @param wait 指定时间间隔
 * @param immediate 指定是否立即执行函数
 * @returns {Function}
 */

export  function debunce(func, wait = 1000, immediate = true) {
    let timeout = null;

    return function (...args) {
        let context = this;

        if (timeout) {
            clearTimeout(timeout);
        }

        if (immediate) {
            let callNow = !timeout;
            timeout = setTimeout(() =>{
                timeout = null;
            }, wait);

            if (callNow) {
                func.apply(context, args);
            }
        } else {
            timeout = setTimeout( () => {
                func.apply(context, args);
            }, wait);
        }
    }
}


/**
 * 节流(throttle)
 * 所谓节流，就是指连续触发事件但是在 n 秒中只执行一次函数。
 *
 * @param func 需要进行节流处理的函数
 * @param wait 指定时间间隔
 * @param type 1 表示时间戳版, 2 表示定时器版
 * @returns {Function}
 */

export function throttle(func, wait = 1000, type = 1) {
    let previous = 0;
    let timeout = null;

    return function (...args) {
        let context = this;
        if (type == 1) {  // 使用 == 兼容字符串;
            let now = Date.now();

            if (now - previous > wait) {
                func.apply(context, args);
                previous = now;
            }
        } else if (type == 2) {
            if (!timeout) {
                timeout = setTimeout( () => {
                    timeout = null;
                    func.apply(context, args);
                }, wait);
            }
        }
    }
}

/**
 * 深度遍历
 * 遍历树性DOM结构
 * 递归遍历
 *
 * @param node
 * @param nodeList
 * @returns {Array}
 */

export function deepTraversal (node, nodeList = []){
    if(node != null){
        nodeList.push(node);
        let children = node.children;
        for(let i=0;i<children.length;i++){
            deepTraversal(children[i], nodeList);
        }
    }
    return nodeList;
}


/**
 * 深度遍历
 * 遍历树性DOM结构
 * 非递归遍历
 *
 *
 * @param node
 * @returns {Array}
 */

export function deepTraversal2 (node){
    let stack = [];
    let nodes = [];
    if(node){
        stack.push(node);
    }

    while(stack.length){
        let item = stack.pop();
        let children = item.children;
        nodes.push(item);
        for(let i = children.length -1;i>=0;i--){
            stack.push(children[i]);
        }
    }

    return nodes;
}


/**
 * 广度遍历 遍历树性DOM结构
 * 非递归遍历
 *
 * @param node
 * @returns {Array}
 */

export function widthTraversal (node){
    let nodes = [];
    let stack = [];
    if(node){
        stack.push(node);
        while(stack.length){
            let item = stack.shift();
            let children = item.children;
            nodes.push(item);
            for(let i=0;i<children.length;i++){
                stack.push(children[i]);
            }
        }
    }
    return nodes;
}

/**
 * sleep函数
 *
 * @param ms
 */

export function sleep(ms) {
    let start = Date.now();
    let expire = start + ms;

    while (Date.now() < expire) ;
    return;
}


/**
 * better async func error capture;
 * 减少async try {}catch
 *
 * @param asyncFunc
 * @param params
 * @returns {Promise<*[]>}
 */

export async function errorCaptured(asyncFunc, ...params){
    try{
        let res = await asyncFunc(...params);
        return [null,res];
    }catch (e) {
        return [e, null];
    }
}


/**
 * format Bytes
 *
 *
 * @param bytes
 * @returns {string}
 */

export function formatBytes(bytes) {
    if(bytes < 1024){
        return bytes + " Bytes";
    } else if(bytes < 1048576) {
        return(bytes / 1024).toFixed(3) + " KB";
    } else if(bytes < 1073741824){
        return(bytes / 1048576).toFixed(3) + " MB";
    } else{
        return(bytes / 1073741824).toFixed(3) + " GB";
    }
}

















