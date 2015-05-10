/*公共函数*/

/*
获取元素到页面顶端的距离(出自jquery源码)
原理：
*/
function getCoords(el){
    
  if(typeof el == 'string')
  {
    el = Fid(el);
  }
    
  var box = el.getBoundingClientRect(),
  doc = el.ownerDocument,
  body = doc.body,
  html = doc.documentElement,
  clientTop = html.clientTop || body.clientTop || 0,
  clientLeft = html.clientLeft || body.clientLeft || 0,
  top  = box.top  + (self.pageYOffset || html.scrollTop  ||  body.scrollTop ) - clientTop,
  left = box.left + (self.pageXOffset || html.scrollLeft ||  body.scrollLeft) - clientLeft
  return { 'top': top, 'left': left };
};

    
function Fid(id)
{
    return document.getElementById(id);    
}

/***********************************固定的元素************************************/

/**
 * 注意占位符的高度一定要和浮动层相同
 
 * @param id string 元素id
 * @param fixtop int 元素固定时距离顶端的距离
 * @param zIndex int 层级
 * @param string 占位符的id(请勿忘记哦)
 */
function fixeDiv(id, fixtop, zIndex, place)
{
    //获取scrolltop
    function getScrollTop()
    {
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        return  scrollTop;
    }

    var elementTop = getCoords(id).top;

    //w3c
    function navfixed()
    {
        //需要动态获取
        var scrollTop = getScrollTop();
       
        if(scrollTop>elementTop-fixtop)
        {
            Fid(id).style.position = 'fixed';
            Fid(id).style.zIndex = zIndex;
            Fid(id).style.top = fixtop+'px';
            
            //占位符
            if(place)
            {
                Fid(place).style.display = 'block';
            }    
        }else{
            Fid(id).style.position = 'relative';
            if(place)
            {
                Fid(place).style.display = 'none';
            }    
            Fid(id).style.top = '0px';
        }
    }

    //nav 一直处于相对定位 状态
    function navfixedie6()
    {    
        var scrollTop = getScrollTop();
        if(scrollTop > elementTop - fixtop)
        {
            Fid(id).style.top = (scrollTop-elementTop + fixtop)+'px';
            Fid(id).style.zIndex = zIndex;
        }
        else
        {
            Fid(id).style.top = '0px';
        }
    }

    //非IE浏览器下
    if (document.addEventListener) {
        window.addEventListener("load",navfixed,true);
        //window.addEventListener("resize",navfixed,true);
        window.addEventListener("scroll",navfixed,true);
    };

    //ie8 ie7(支持fixed定位)
    if (document.attachEvent&&window.ActiveXObject&&window.XMLHttpRequest) {
        window.attachEvent("onload",navfixed);
        //window.attachEvent("onresize",navfixed);
        window.attachEvent("onscroll",navfixed);
    };

    //ie6
    if (document.attachEvent&&window.ActiveXObject&&!window.XMLHttpRequest) {
        //元素自始至终一定要是 relative
        Fid(id).style.position = 'relative';
        
        window.attachEvent("onload",navfixedie6);
        //window.attachEvent("onresize",navfixedie6);
        window.attachEvent("onscroll",navfixedie6);
    };
}
//顶部
fixeDiv('nav', 0,  10, 'place');

//左侧
var navHeight = Fid('nav').offsetHeight;
fixeDiv('leftnav', navHeight, 10, 'leftplace');



//滑动定位
function scroll_nav_pos(g_id_target_map)
{   
    //id对应关系
    this.id_target_map = g_id_target_map;
    
    //获取每个元素距离顶端距离
    this.header_top_map = {};
    
    //初始化
    this.init();
}

scroll_nav_pos.prototype = {
    getHeaderTop:function () {//获取每个元素到页面顶端的距离
            for(var i in this.id_target_map)
            {
                if(Fid(i) && Fid(this.id_target_map[i]))
                {
                    this.header_top_map[i] = getCoords(this.id_target_map[i]).top;
                }
            }
    },
    
    refreshHeaderTop:function(){//刷新位置的对应关系
        this.getHeaderTop();
    },
    
    goTo:function (id)//点击跳转跳指定位置
    {
        if(this.header_top_map[id] == undefined)
        {
            return ;
        }
        
        var scrollTop = this.header_top_map[id];
        var navHeight = Fid('nav').offsetHeight;

        document.documentElement.scrollTop = document.body.scrollTop = scrollTop-navHeight;
    },
    setHeaderStyle: function (id){//设置元素样式
        for(var i in this.id_target_map)
        {
            if(Fid(i) && Fid(this.id_target_map[i]))
            {
                if(i == id)
                {
                    Fid(i).className = 'on';
                }else{
                    Fid(i).className = '';
                }
            }
        }
    },
    clickBind:function(){ //每个元素绑定单击事件
        var _this = this;

        var counter = 0;
        for(var i in this.id_target_map)
        {
            //两个id都存在才会绑定
            if(Fid(i) && Fid(this.id_target_map[i]))
            {
                Fid(i).onclick = function(){
                    _this.goTo(this.id);
                }
              
                //为第一个元素添加样式
                if(counter == 0)
                {
                    Fid(i).className = 'on';
                }    
                
                counter++
            }
        }
    },
    scrollBind:function(){//绑定滚动事件
        var _this = this;
        function dynamic_set_header(){

            var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
            var navheight = Fid('nav').offsetHeight;
            
            for(var i in _this.id_target_map)
            {
                var top = _this.header_top_map[i];
                
                if(scrollTop>=top-navheight)
                {
                    _this.setHeaderStyle(i);
                }
            } 
        }
        
        //非IE浏览器下
        if (document.addEventListener) {
            window.addEventListener("load",dynamic_set_header,true);
            //window.addEventListener("resize",dynamic_set_header,true);
            window.addEventListener("scroll",dynamic_set_header,true);
        }
        
        if (document.attachEvent&&window.ActiveXObject) {
            
            window.attachEvent("onload",dynamic_set_header);
            //window.attachEvent("onresize",dynamic_set_header);
            window.attachEvent("onscroll",dynamic_set_header);
        };
    },
    
    init:function(){//初始化
        this.getHeaderTop();
        this.clickBind();
        this.scrollBind();
    }
}

//可以随意添加删除元素
var g_id_target_map = {
    'A':'_A',
    'B':'_B',
    'C':'_C',
    'D':'_D',
    'E':'_E'
}

var navScrollObj = new scroll_nav_pos(g_id_target_map);

//当面元素位置发生变化时记得刷新哦
//navScrollObj.refreshHeaderTop();


//可以随意添加删除元素
var g_id_target_map_2 = {
    'F':'_A',
    'G':'_B',
    'H':'_C',
    'I':'_D',
    'J':'_E'
}

new scroll_nav_pos(g_id_target_map_2);

//******************************滑动定位 end **********************

