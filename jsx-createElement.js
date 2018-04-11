class React {
    constructor() {
    }

    static createElement(type, options, ...arg) {//标签名，属性，子元素
        //=>arg存储的是剩下的参数集合，即使没有其余的参数了，arg也是一个空数组
        //=>处理初始值，options肯定是一个对象。(不管传或不传)
        options = options || {};

        //HANDLE
        let obj = {//模拟虚拟DOM
            type,
            key: null,
            ref: null,
            porps: {}
        };

        //key && ref
        ['key', 'ref'].forEach((item) => {
            if (item in options) {
                obj[item] = options[item];
                delete options[item];
            }
        });
        //props
        obj.props = {...options};
        let len = arg.length;
        switch (len) {
            case 0:
                //没有子节点，不需要设置children
                break;
            case 1:
                //只有一个子元素(基本都是文本节点)
                obj.props.children = arg[0];
                break;
            default:
                //多个子节点
                obj.props.children = JSON.parse(JSON.stringify(arg));
        }


        return obj;
    }
}

class ReactDOM {
    static handChile(children, newEle) {
        if (typeof children === 'object') {
            //当前唯一的子节点是一个新元素
            ReactDOM.render(children, newEle);
        } else {
            //当前唯一的子节点是一个文本
            let text = document.createTextNode(children)
            newEle.appendChild(text);
        }
    }

    static render(objJSX, container, callback) {
        let {type, props} = objJSX;
        newEle = document.createElement(type);
        //给新创建的元素设置各种属性
        for (let key in props) {
            if (!props.hasOwnProperty(key)) continue;

            //children
            if (key === 'children') {
                let children = props['children'];
                if (children instanceof Array) {
                    //有多个子节点
                    children.forEach((itemChild) => {
                        ReactDOM.handChile(itemChild, newEle);
                    });
                    continue;
                }
                //只有一个子节点
                ReactDOM.handChile(children, newEle);
                continue;
            }


            //一般情况下把props中的属性直接赋值给元素即可(例如：props={id：'box'}=>newEle['id']='box')
            newEle.setAttribute(key, props[key]);//这种方式可以体现在元素的结构上

            //calss
            if (key === 'className') {
                newEle.setAttribute('class', props['className']);
                continue;
            }

            //STYLE的处理，props.style={}依次遍历，设置给元素==>newEle.style=''
            if (key === 'style') {
                for (let key in props['style']) {
                    if (props['style'].hasOwnProperty(key)) {
                        newEle['style'][key] = props['style'][key];
                    }
                }
            }
        }
        container.appendChild(newEle);
        callback && callback();
    }
}

ReactDOM.render(jsx_ele, container, callback);

// let result = React.createElement('div', {})