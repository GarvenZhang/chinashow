/**
 * Created by jm_hello on 2017/2/13.
 */
//JM
var JM={};
/**
 * EventUtil
 * @param element
 * @param type
 * @param handler
 */

/******************************************Basic Events****************************************/
//add event procedure
JM.addHandler=function (element,type,handler,useCap) {//添加事件处理程序
    if(element.addEventListener)this.addHandler=function (element,type,handler,useCap) {
        // console.log(handler);
        element.addEventListener(type,handler,useCap);
    };

    else if(element.attachEvent)this.addHandler=function (element,type,handler) {
        console.log(element);
        element.attachEvent('on'+type,handler);//IE
    };
    else this.addHandler=function (element,type,handler) {
            console.log(element);
            element['on'+type]=handler;//DOM0
        };
    this.addHandler(element,type,handler,useCap);
};

//remove event procedure
JM.removeHandler=function (element,type,handler,useCap) {//删除事件处理程序
    if(element.removeEventListener)this.removeHandler=function (element,type,handler,useCap) {
        element.removeEventListener(type,handler,useCap);//DOM2
    };

    else if(element.detachEvent)this.removeHandler=function (element,type,handler) {
        element.detachEvent('on'+type,handler);//IE
    };
    else this.removeHandler=function (element,type) {
            element['on'+type]=null;//DOM0
        };
    this.removeHandler(element,type,handler,useCap);
};

//get event object
JM.getEvent=function (event) {
    if(event)
        this.getEvent=function (event) {
            return event;
        };
    else
        this.getEvent=function (event) {
            return window.event;
        };
    return this.getEvent(event);
};

//get the actual event target
JM.getTarget=function (event) {
    if(event.target)
        this.getTarget=function (event) {
            return event.target
        };
    else
        this.getTarget=function (event) {
            return event.srcElement
        };
    return this.getTarget(event);
};

//stop default behavior
JM.preventDefault=function (event) {
    if(event.preventDefault)
        this.preventDefault=function (event) {
            event.preventDefault();
        };
    else
        this.preventDefault=function (event) {
            event.returnValue=false;
        };
    this.preventDefault(event);
};

//stop bubbling
JM.stopPropagation=function (event) {//取消事件进一步捕获或冒泡
    if(event.stopPropagation)
        this.stopPropagation=function (event) {
            event.stopPropagation();
        };
    else
        this.stopPropagation=function (event) {
            event.cancelBubble=true;
        };
    this.stopPropagation(event);
};

//get data from the clipboard
JM.getClipboardText=function (event) {
    if(event.clipboardData) this.getClipboardText=function (event) {
        return event.clipboardData.getData('text');
    };
    else this.getClipboardText=function () {
        return window.clipboardData.getData('text');//ie
    };
    return this.getClipboardText(event);
};

//set data to the clipboard
JM.setClipboardText=function (event,value) {
    if(event.clipboardData) this.setClipboardText=function (event) {
        return event.clipboardData.setData("text/plain",value);
    };
    else this.setClipboardText=function (value) {
        return window.clipboardData.setData('text',value);//ie
    };
    return this.setClipboardText(event,value);
};

//get the position of curson in the inputs
JM.getCursorPosition=function (ctrl) {//获取光标位置函数
    var CaretPos = 0;
    if (document.selection) // IE Support
        this.getCursorPosition=function (ctrl) {
            ctrl.focus();
            var Sel = document.selection.createRange();
            Sel.moveStart('character', -ctrl.value.length);
            CaretPos = Sel.text.length;
            console.log(-ctrl.value.length);
            return CaretPos;
        };
    else if (ctrl.selectionStart || ctrl.selectionStart == '0')
        this.getCursorPosition=function (ctrl) {
            CaretPos = ctrl.selectionStart;
            // console.log(ctrl.selectionEnd);
            return CaretPos;
        };

    return this.getCursorPosition(ctrl);
};

// selectText
JM.selectText=function (textbox,startIndex,endIndex) {
    if(textbox.setSelectionRange) this.selectText=function (textbox,startIndex,endIndex) {
        textbox.setSelectionRange(startIndex,endIndex);
        textbox.focus();
    };
    else if(textbox.createTextRange) this.selectText=function (textbox,startIndex,endIndex) {
        var range=textbox.createTextRange();//create the range
        range.collapse(true);//fold the range to the start position
        range.moveStart('character',startIndex);
        range.moveEnd('character',endIndex-startIndex);
        range.select();
        textbox.focus();
    };
    this.selectText(textbox,startIndex,endIndex);
};

//getSelectedText
JM.getSelectedText=function (textbox) {
    if(typeof textbox.selectionStart == 'number') this.getSelectedText=function (textbox) {
        // console.log('aaa');
        return textbox.value.substring(textbox.selectionStart,textbox.selectionEnd);
    };
    else if(document.selection) this.getSelectedText=function () {
        // console.log('bbb');
        return document.selection.createRange().text;
    };
    return this.getSelectedText(textbox);
};

//throttle
JM.throttle=function (fn,interval) {
    var _self=fn,//save the quote of function which is delayed
        timer,//a timer
        firstTime=true;//whether use it for the first time
    return function () {
        var args=arguments,//save the variable arguments
            _me=this;
        //if the function is carried out for the first time, don't need to delay implement
        if(firstTime){
            _self.apply(_me,args);
            return firstTime=false;
        }
        // if timer still exists,that is to say, the last delayed implement didn't implement
        if(timer){
            return false;
        }
        timer=setTimeout(function () {//delay to carry out
            clearTimeout(timer);
            timer=null;
            _self.apply(_me,args);
        },interval||500);
    };
};

//timeChunk
JM.timeChunk=function (ary,fn,count,interval) {
    var obj,
        t;
    var len=ary.length;
    var start=function () {
        for(var i=0;i<Math.min(count||1,ary.length);i++){
            var obj=ary.shift();
            fn(obj);
        }
    };
    return function () {
        t=setInterval(function () {
            if(ary.length===0){//if all nodes have been created
                return clearInterval(t);
            }
            start();
        },interval||200);
    };
};

//getValueLength
JM.getValueLength=function (ele) {
    var html=ele.innerHTML;
    if(typeof html == 'string'){
        return html.length;
    }
};
/***********************************************Keyboard Events******************************************/
//getCharCode
JM.getCharCode=function (event) {
    if(event.charCode)
        this.getCharCode=function (event) {
            // console.log(event.charCode);
            return event.charCode; //ie9+ ff chrome safari
        };
    else
        this.getCharCode=function (event) {
            // console.log(event.keyCode);
            return event.keyCode;//ie<=8 opera
        };
    return this.getCharCode(event);
};

//getIdentifier
JM.getIdentifier=function (event) {
    if( event.key)
        this.getIdentifier=function (event) {
            return event.key; //ie9
        };
    else
        this.getIdentifier=function (event) {
            return event.keyIdentifier;//chrome safari5
        };
    return this.getIdentifier(event);
};

//getLocation
JM.getLocation=function (event) {
    if( event.location)
        this.getLocation=function (event) {
            return event.location; //ie9
        };
    else
        this.getLocation=function (event) {
            return event.keyLocation;//chrome safari5
        };
    return this.getLocation(event);
};


/*******publish-subscribe pattern*****/
JM.pSPattern={
    'list':{},
    'listen':function (key,fn) {
        if(!this.list[key]) this.list[key]=[];
        this.list[key].push(fn);
    },
    'trigger':function () {
        var key=Array.prototype.shift.call(arguments),
            fns=this.list[key];
        if(!fns||fns ===0) return false;
        for(var i=0,fn;fn=fns[i++];){
            fn.apply(this,arguments);
        }
    },
    'remove':function (key,fn) {
        var fns=this.list[key];
        if(!fns) {
            return false;
        }
        if(!fn) {
            fns && (fns.length=0);
        }else{
            for(var l=fns.length-1;l>=0;l--){
                var _fn=fns[l];
                if(_fn===fn){
                    fns.splice(l,1);
                }
            }
        }
    }
};

/**************************************************** ajax **********************************************/
JM.ajax=function (url,method,boolean,data,fn) {
    var xhr=JM.createXHR();
    xhr.onreadystatechange=function () {

        if(xhr.readyState==4){
          if(xhr.status>=200 && xhr.status<300 || xhr.status==304){
              console.log(xhr.status);
              if(fn)fn(xhr);
          }
      }
    };

    xhr.open(method,url,boolean);
    xhr.send(data||null);
};

 JM.createXHR =function(){
    //ie>=7,Firefox,Opera,Chrome,Safari support original XHR object
    if (typeof XMLHttpRequest != "undefined"){
        return new XMLHttpRequest();
    }
    //ie<7
    else if (typeof ActiveXObject != "undefined"){
        if (typeof arguments.callee.activeXString != "string"){
            var versions = [ "MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0",
                    "MSXML2.XMLHttp"],
                i, len;
            for (i=0,len=versions.length; i < len; i++){
                try {
                    new ActiveXObject(versions[i]);
                    arguments.callee.activeXString = versions[i];
                    break;
                } catch (ex){
                    console.error(ex);
                }
            }
        }
        return new ActiveXObject(arguments.callee.activeXString);
    }
    //can't find original objext XHR and ActiveObject,will throw err
    else {
        throw new Error("No XHR object available.");
    }
};


/****************************************** get elements **********************************************/

JM.getId=function (id) {
    return document.getElementById(id);
};
JM.getEle=function (cssText) {
    return document.querySelector(cssText);
};
JM.getEles=function (cssText) {
    return document.querySelectorAll(cssText);
};

/*******************************************sort****************************/
JM.swap=function (arr,index1,index2) {
    var temp=arr[index1];
    arr[index1]=arr[index2];
    arr[index2]=temp;
};
//bubble sort
JM.bubbleSort=function (element) {
    var ele=element,
        outer=ele.length;
    for(;outer>=2;--outer){
        for(var inner=0;inner<outer-1;++inner){
            if(ele[inner]>ele[inner+1]){
                JM.swap(ele,inner,inner+1);
            }
        }
    }
};

//selection sort
JM.selectionSort=function (element) {
    var ele=element,
        len=ele.length,
        outer=0,
        min;
    for(;outer<=len-2;++outer){
        min=outer;
        for(var inner=outer+1;inner<=len-1;++inner){
            if(ele[inner]<ele[min]){
                min=inner;
            }
            JM.swap(ele,outer,min);
        }
    }
};

//insertionSort
JM.insertionSort=function (element) {
    var ele=element,
        len=ele.length,
        outer=1,
        inner,
        temp;
    for(;outer<=len-1;++outer){
        temp=ele[outer];
        inner=outer;
        while(inner>0 && (ele[inner-1] >=temp)){
            ele[inner]=ele[inner-1];
            --inner;
        }
        ele[inner]=temp;
    }
};
/*****************************************search*********************************/
//sequence search
JM.seqSearch=function (arr,data) {
    var i=0,
        len=arr.length;
    for(;i<len;i++){
        if(arr[i]==data) return i;
    }
    return -1;
};
//find min num
JM.findMin=function (arr) {
    var min=arr[0],
        len=arr.length;
    for(var i=1;i<len;i++){
        if(arr[i]<min) min=arr[i];
    }
    return min;
};
//find max num
JM.findMax=function (arr) {
    var max=arr[0],
        len=arr.length;
    for(var i=1;i<len;i++){
        if(arr[i]>max) max=arr[i];
    }
    return max;
};
/***********************************************Node********************************************************/

//create elements
JM.createEle=function (ele,fn) {
    var el=document.createElement(ele);
    if(fn) fn(el);
    return el;
};

//getFirstChild
JM.getFirstChild=function (nodes) {
    if(nodes.firstElementChild) this.getFirstChild=function (nodes) {
        return nodes.firstElementChild;
    };
    else this.getFirstChild=function (nodes) {
        return nodes.firstChild;
    };
    return this.getFirstChild(nodes);
};

//getLastChild
JM.getLastChild=function (nodes) {
    if(nodes.lastElementChild) this.getLastChild=function (nodes) {
        return nodes.lastElementChild;
    };
    else this.getLastChild=function (nodes) {
        return nodes.lastChild;
    };
    return this.getLastChild(nodes);
};

//getChildren
JM.getChildren=function (nodes) {
    if(nodes.children) this.getChildren=function (nodes) {
        return nodes.children;
    };
    else this.getChildren=function (nodes) {
        return nodes.childNodes;
    };
    return this.getChildren(nodes);
};

//getNextChild
JM.getNextChild=function (nodes) {
    if(nodes.firstElementChild) this.getNextChild=function (nodes) {
        return nodes.nextElementSibling;
    };
    else this.getNextChild=function (nodes) {
        return nodes.nextSibling;
    };
    return this.getNextChild(nodes);
};


//addNodes
JM.addNodes=function (parentNode,newNode) {
    var nodes=JM.getChildren(parentNode),
        i=nodes.length;
    if(i>0){
        parentNode.insertBefore(newNode,nodes[i]);
    }else{
        parentNode.appendChild(newNode);
    }
};

JM.removeNodes=function (parentNode,node) {
    parentNode.removeChild(node);
};

//getPreChild
JM.getPreChild=function (nodes) {
    if(nodes.previousElementSibling) this.getPreChild=function (nodes) {
        return nodes.previousElementSibling;
    };
    else this.getPreChild=function (nodes) {
        return nodes.previousSibling;
    };
    return this.getPreChild(nodes);
};
//addClass
// JM.addClass=function (className) {
//     var cName=className,
//         i=cName;
//
// };

JM.addClass=function (eleOrObj,classname) {
    if(!eleOrObj.nodeType) {
        for (var className in eleOrObj)
            if (!new RegExp('\\b' + className + '\\b', 'gi').test(eleOrObj[className].className))
                eleOrObj[className].className = eleOrObj[className].className.concat(' ' + className);
    } else if(!new RegExp('\\b'+classname+'\\b','gi').test(eleOrObj.className))
        eleOrObj.className=eleOrObj.className.concat(' '+classname);
};
JM.removeClass=function (eleOrObj,classname) {
    if(!eleOrObj.nodeType) {
        for (var className in eleOrObj)
            if(new RegExp('\\b'+className+'\\b','gi').test(eleOrObj[className].className))
                eleOrObj[className].className=(''+eleOrObj[className].className+'').replace(className,'');
    } else if(new RegExp('\\b'+classname+'\\b','gi').test(eleOrObj.className))
        eleOrObj.className=(''+eleOrObj.className+'').replace(classname,'');
};

//getStyle
JM.getStyle=function (element,attrName) {
    if(element.currentStyle) this.getStyle=function (element,attrName) {
        return element.currentStyle[attrName];
    };
    else this.getStyle=function (element,attrName) {
        return getComputedStyle(element,false)[attrName];
    };
    return this.getStyle(element,attrName);
};

//nameSpace
JM.createNameSpace=function (obj,name) {
    var part=name.split('.'),
        current=obj;
    for(var i in obj){
        if(!current[part[i]]){
            current[part[i]]={};
        }
        current=current[part[i]];
    }
};

//getSingle
var getSingle=function (fn) {
    var result;
    return function () {
        return result || (result=fn.apply(this,arguments));
    }
};

/*************************************convert Nodes to Array***********************************************/
JM.convertToArray=function (nodes) {
    var array=null;
    try{
        array.prototype.slice.call(nodes,0);// except IE
        console.log(array);
    }catch (ex){
        //IE
        array=new Array();
        for(var i=0,len=nodes.length;i<len;i++){
            array.push(nodes[i]);
        }
    }
    return array;
};



/*judge the type of data*/
JM.isType=function (type) {
    return function (obj) {
        return Object.prototype.toString.call(obj)==='[object'+type+']';
    }
};


/*********************************************iterator*************************************/


JM.inArray=function (elem,arr,i) {
    var len,
        a=arr.reverse();
    if(arr){
        // if(arr.indexOf) return arr.indexOf.call(arr,elem,i);
        len=a.length;
        i=i ? (i<0 ? Math.max(0,len+i):i):0;
        for(;i<len;i++){
            if(a[i]==elem) {
                return i;
            }
        }
    }

    return -1;
};

//inner iterator
JM.inIterator=function (ary,callback) {
    // var i=0,
    //     len=ary.length;
    // for(;i<len;i++){
    //     callback.call(ary[i],i,ary[i]);
    // }
    for(var i=0,len=ary.length;i<len;i++) callback(i,ary[i]);
};

//outer iterator
JM.outIterator=function (obj) {
    var current=0,
        len=obj.length;
    var next=function () {
        current+=1;
    };
    var isDone=function () {
        return current>=len;
    };
    var getCurrentItem=function () {
        return obj[current];
    };
    return{
        'next':next,
        'isDone':isDone,
        'getCurrentItem':getCurrentItem
    }
};

//iterator array or object
JM.iterator=function (obj,callback) {
    var value,
        i=0,
        len=obj.length,
        isArray=JM.isType('Array');
    if(isArray(obj)) this.iterator=function (obj,callback) {
        for(;i<len;i++){
            value=callback.call(obj[i],i,obj[i]);
            if(value===false) break;
        }
        return obj;
    };


    else this.iterator=function (obj,callback) {
        for(i in obj){
            value=callback.call(obj[i],i,obj[i]);
            if(value===false) break;
        }
        return obj;
    };
    return this.iterator(obj,callback);
};

//reverse iterator
JM.reverseIterator=function (ary,callback) {
    var i=ary.length-1;
    for(;i>=0;i--){
        callback(i,ary[i]);
    }
};
/******************************************** load imgs******************************************/
//an object used to create img nodes
var loadImage=(function () {

})();

JM.loadImgProxy=(function () {

    return function (src,callback) {
        var imgCache=new Image();
        if(imgCache.complete){

        }
    }

})();
// JM.preloadImg=function (url,callback) {
//     var imgCache=new Image();//create an img object
//     // if(imgCache.complete){
//     //     console.log(2);
//     //    callback.call(imgCache);
//     //     return;
//     // }
//     imgCache.onload=function () {
//         imgCache.onload=null;
//         callback(imgCache);
//         console.log(3);
//     };
//     imgCache.src=url;
// };

/*********************************data structure*******************************/
//List
JM.List=function() {
    this.listSize=0;//列表的元素个数
    this.pos=0;
    this.dataStore=[];
};
JM.List.prototype={
    'constructor':JM.List,
    append:function (element) {
            this.dataStore[this.listSize++]=element;
    },
    find:function (element) {
        var i=0,
            len=this.dataStore.length;
        for(;i<len;i++){
            if(this.dataStore[i]==element) return i;
        }
        return -1;
    },
    remove:function (element) {
        var foundAt=this.find(element);
        if(foundAt>-1){
            this.dataStore.splice(foundAt,1);
            --this.listSize;
            return true;
        }
        return false;
    },
    length:function () {
        return this.listSize;
    },
    toString:function () {
        return this.dataStore;
    },
    insert:function (element,after) {
        var insertPos=this.find(after);
        if(insertPos>-1){
            this.dataStore.splice(insertPos+1,0,element);
            ++this.listSize;
            return true;
        }
        return false;
    },
    clear:function () {
        delete this.dataStore;
        this.dataStore=[];
        this.listSize=this.pos=0;
    },
    contains:function (element) {
        var i=0,
            len=this.dataStore.length;
        for(;i<len;i++){
            if(this.dataStore[i]==element) return true;
        }
        return false;
    },
    front:function () {
        this.pos=0;
    },
    end:function () {
        this.pos=this.listSizes-1;
    },
    prev:function () {
        if(this.pos>0) --this.pos;
    },
    next:function () {
        if(this.pos<this.listSize-1) ++this.pos;
    },
    currPos:function () {
                return this.pos;
                },
    moveTo:function (position) {
            this.pos=position;
        },
    getElement:function () {
            return this.dataStore[this.pos];
        }
};

//Queue
JM.Queue=function () {
    this.items=[];
};
JM.Queue.prototype={
    constructor:JM.Queue,
    enqueue:function (element) {
    this.items.push(element);
},
    dequeue:function () {
        this.items.shift();
    },
    front:function () {
        return items[0];
    },
    isEmpty:function () {
        return items.length==0;
    },
    clear:function () {
        this.items=[];
    },
    size:function () {
        return items.length;
    },
    print:function(){
    console.log(items.toString());
}
};

//SingleList
JM.SingleList=function () {
    this.Node=function (element) {
        this.element=element;
        this.next=null;
    };
    this.length=0;
    this.head=null;
};
JM.SingleList.prototype={
    constructor:JM.SingleList,
    append:function (element) {
    var node=new this.Node(element),
        current;
    if(this.head==null){
        this.head=node;
    }else{
        current=this.head;
        while(current.next){
            current=current.next;
        }
        current.next=node;
    }
    this.length++;
},
    removeAt:function (position) {
        if(position>0 && position < this.length){
            var current=head,
                previous,
                index=0;
            if(position===0){
                head=current[this.next];
            }else{
                while (index++<position){
                    previous=current;
                    current=current.next;
                }
                previous.next=current.next;
            }
            this.length--;
            return current.element;
        }else{
            return null;
        }
    },
    insert:function (position,element) {
        if(position>=0 && position <=this.length){
            var node=new JM.BSTNode(element),
                current=this.head,
                previous,
                index=0;
            if(position==0){
                node.next=current;
                head=node;
            }else{
                while(index++<position){
                    previous=current;
                    current=current.next;
                }
                node.next=current;
                previous.next=node;
            }
            this.length++;
            return true;
        }else{
            return false;
        }
    },
    indexOf:function (element) {
        var current=this.head,
            index=-1;
        while(current){
            if(element==current.element){
                return index;
            }
            index++;
            current=current.next;
        }
        return -1;
    },
    isEmpty:function () {
        return this.length==0;
    },
    size:function () {
        return this.length;
    },
    getHead:function () {
    return this.head;
}
};
/*SingleList.prototype.remove=function (element) {
 var index=this.indexOf(element);
 return this.removeAt(index);
 };*/

//BST
//inheritPrototype
JM.inheritPrototype=function (subType,superType) {
    var prototype=new Object(superType.prototype);
    prototype.constructor=subType;
    subType.prototype=prototype;
};

var showBSTData_$=function() {
    return this.data;
};
JM.BSTNode=function (data,left,right) {
    this.data=data;
    this.left=left;
    this.right=right;
    this.show=showBSTData_$;
};
JM.BST=function () {
    this.root=null;
};
JM.BST.prototype={
    constructor:JM.BST,
    insert:function (data,obj) {
        if(!obj)obj=JM.BSTNode;
        var node =new obj(data,null,null);
        if(this.root==null){
            this.root=node;
        }else{
            var current=this.root,
                parent;
            while(true){
                parent=current;
                if(data<current.data){
                    current=current.left;
                    if(current==null){
                        parent.left=node;
                        break;
                    }
                }else{
                    current=current.right;
                    if(current==null){
                        parent.right=node;
                        break;
                    }
                }
            }
        }
    },
    search:function (data) {
        var current=this.root;
        while(current!=null){
            if(current.data==data) return current;
            else if(data<current.data) current=current.left;
            else current=current.right;
        }
        return null;
    },
    remove:function (node,data) {
        if(node==null) return null;
        if(data==node.data){
            if(node.left==null && node.right==null) return null;
            if(node.left==null) return node.right;
            if(node.right==null) return node.left;
            var tempNode=this.getMinNode(node.right);
            node.data=tempNode.data;
            node.right=this.remove(node.right,tempNode.data);
            return node;
        }else if(data<node.data){
            node.left=this.remove(node.left,data);
            return node;
        }else{
            node.right=this.remove(node.right,data);
            return node;
        }
    },
    inOrder:function (node,callback) {
        if(node!==null){
            this.inOrder(node.left,callback);
            callback(node.data);
            this.inOrder(node.right,callback);
        }
    },
    preOrder:function (node,callback) {
        if(node!==null){
            callback(node.data);
            this.preOrder(node.left,callback);
            this.preOrder(node.right,callback);
        }
    },
    postOrder:function (node,callback) {
        if(node!==null){
            this.postOrder(node.left,callback);
            this.postOrder(node.right,callback);
            callback(node.data);
        }
    },
    getMin:function () {
        var current=this.root;
        while(current.left!==null){
            current=current.left;
        }
        return current.data;
    },
    getMinNode:function () {
        var current=this.root;
        while(current.left!==null){
            current=current.left;
        }
        return current;
    },
    getMax:function () {
        var current=this.root;
        while(current.right!==null){
            current=current.right;
        }
        return current.data;
    },
    getMaxNode:function () {
        var current=this.root;
        while(current.right!==null){
            current=current.right;
        }
        return current;
    }
};

JM.BSTNode_ih=function (data,left,right) {
    JM.BSTNode.apply(this,arguments);
    this.count=1;
};
JM.BST_count=function () {
    JM.BST.call(this);
};
JM.inheritPrototype(JM.BST_count,JM.BST);
JM.BST_count.prototype.update=function (data) {
    var grade=this.search(data);
    grade.count++;
    return grade;
};



JM.createObjURL=function (blob) {
    if(window.URL) this.createObjURL=function (blob) {
        return window.URL.createObjectURL(blob);
    };
    else if(window.webkitURl) this.createObjURL=function (blob) {
        return window.webkitURl.createObjectURL(blob);
    };
    else this.createObjURL=function () {
            return null;
        };
    return this.createObjURL(blob);
};

/******************************** realize AOP by Function.prototype **********************************/
Function.prototype.before=function (beforeFn) {
    var _self=this;//save the quote of the original function
    return function () {// return the agency function including original and new functions
        beforeFn.apply(this,arguments); //excute the new function,amend this
        return _self.apply(this,arguments);//excute the original function
    }
};

Function.prototype.after=function (afterFn) {
    var _self=this;
    return function () {
        var ret=_self.apply(this,arguments);
        afterFn.apply(this,arguments);
        return ret;
    };
};
