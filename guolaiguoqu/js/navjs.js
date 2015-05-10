/*��������*/

/*
��ȡԪ�ص�ҳ�涥�˵ľ���(����jqueryԴ��)
ԭ��
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

/***********************************�̶���Ԫ��************************************/

/**
 * ע��ռλ���ĸ߶�һ��Ҫ�͸�������ͬ
 
 * @param id string Ԫ��id
 * @param fixtop int Ԫ�ع̶�ʱ���붥�˵ľ���
 * @param zIndex int �㼶
 * @param string ռλ����id(��������Ŷ)
 */
function fixeDiv(id, fixtop, zIndex, place)
{
    //��ȡscrolltop
    function getScrollTop()
    {
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        return  scrollTop;
    }

    var elementTop = getCoords(id).top;

    //w3c
    function navfixed()
    {
        //��Ҫ��̬��ȡ
        var scrollTop = getScrollTop();
       
        if(scrollTop>elementTop-fixtop)
        {
            Fid(id).style.position = 'fixed';
            Fid(id).style.zIndex = zIndex;
            Fid(id).style.top = fixtop+'px';
            
            //ռλ��
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

    //nav һֱ������Զ�λ ״̬
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

    //��IE�������
    if (document.addEventListener) {
        window.addEventListener("load",navfixed,true);
        //window.addEventListener("resize",navfixed,true);
        window.addEventListener("scroll",navfixed,true);
    };

    //ie8 ie7(֧��fixed��λ)
    if (document.attachEvent&&window.ActiveXObject&&window.XMLHttpRequest) {
        window.attachEvent("onload",navfixed);
        //window.attachEvent("onresize",navfixed);
        window.attachEvent("onscroll",navfixed);
    };

    //ie6
    if (document.attachEvent&&window.ActiveXObject&&!window.XMLHttpRequest) {
        //Ԫ����ʼ����һ��Ҫ�� relative
        Fid(id).style.position = 'relative';
        
        window.attachEvent("onload",navfixedie6);
        //window.attachEvent("onresize",navfixedie6);
        window.attachEvent("onscroll",navfixedie6);
    };
}
//����
fixeDiv('nav', 0,  10, 'place');

//���
var navHeight = Fid('nav').offsetHeight;
fixeDiv('leftnav', navHeight, 10, 'leftplace');



//������λ
function scroll_nav_pos(g_id_target_map)
{   
    //id��Ӧ��ϵ
    this.id_target_map = g_id_target_map;
    
    //��ȡÿ��Ԫ�ؾ��붥�˾���
    this.header_top_map = {};
    
    //��ʼ��
    this.init();
}

scroll_nav_pos.prototype = {
    getHeaderTop:function () {//��ȡÿ��Ԫ�ص�ҳ�涥�˵ľ���
            for(var i in this.id_target_map)
            {
                if(Fid(i) && Fid(this.id_target_map[i]))
                {
                    this.header_top_map[i] = getCoords(this.id_target_map[i]).top;
                }
            }
    },
    
    refreshHeaderTop:function(){//ˢ��λ�õĶ�Ӧ��ϵ
        this.getHeaderTop();
    },
    
    goTo:function (id)//�����ת��ָ��λ��
    {
        if(this.header_top_map[id] == undefined)
        {
            return ;
        }
        
        var scrollTop = this.header_top_map[id];
        var navHeight = Fid('nav').offsetHeight;

        document.documentElement.scrollTop = document.body.scrollTop = scrollTop-navHeight;
    },
    setHeaderStyle: function (id){//����Ԫ����ʽ
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
    clickBind:function(){ //ÿ��Ԫ�ذ󶨵����¼�
        var _this = this;

        var counter = 0;
        for(var i in this.id_target_map)
        {
            //����id�����ڲŻ��
            if(Fid(i) && Fid(this.id_target_map[i]))
            {
                Fid(i).onclick = function(){
                    _this.goTo(this.id);
                }
              
                //Ϊ��һ��Ԫ�������ʽ
                if(counter == 0)
                {
                    Fid(i).className = 'on';
                }    
                
                counter++
            }
        }
    },
    scrollBind:function(){//�󶨹����¼�
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
        
        //��IE�������
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
    
    init:function(){//��ʼ��
        this.getHeaderTop();
        this.clickBind();
        this.scrollBind();
    }
}

//�����������ɾ��Ԫ��
var g_id_target_map = {
    'A':'_A',
    'B':'_B',
    'C':'_C',
    'D':'_D',
    'E':'_E'
}

var navScrollObj = new scroll_nav_pos(g_id_target_map);

//����Ԫ��λ�÷����仯ʱ�ǵ�ˢ��Ŷ
//navScrollObj.refreshHeaderTop();


//�����������ɾ��Ԫ��
var g_id_target_map_2 = {
    'F':'_A',
    'G':'_B',
    'H':'_C',
    'I':'_D',
    'J':'_E'
}

new scroll_nav_pos(g_id_target_map_2);

//******************************������λ end **********************

