# -*- coding: utf-8 -*-
from django.shortcuts import render_to_response
from django.http import HttpResponse, Http404
from django.template import loader
from django.template.context import RequestContext
from django.views.decorators.csrf import csrf_exempt
from django.db import connection
from ishare_DB.models import *
import datetime
import time

from django.core import serializers
import json
from django.core.urlresolvers import reverse

'''导入json转换方法'''
from extensions.ajaxJson import json_encode 

from django.utils import simplejson


def defalut(request):
    t = loader.get_template('default.html')
    c = RequestContext(request,{"now":datetime .datetime. now()})
    return HttpResponse(t.render(c))
    #return HttpResponse("welcome to ishare!")
    
def isExists(request,name):
    '''判断是否存在制定用户名的用户，是的话已注册'''
    result = True
    user=User.objects.get(username=name)
    if not user:
        result=False
    return result
def addUser(request,name,pwd):
    '''添加某一用户到系统中注册'''
    newUser=User(username=name,
                 password=pwd,
                 alias=name)
    newUser.save()

    theUser=User.objects.get(username=name)
    if not theUser:
        id="failure"
    else:
        id=theUser.user_ID
    return id

@csrf_exempt
def signup(request):
    #return HttpResponse('hello world!')#http://my.oschina.net/giszhang/blog/291323?p=1 其实这个提示的意思是在获取body数据前，数据流已经被读过；问题就出在 @csrf_exempt 上，Django提前对request做了读取验证操作，因此问题就来了：Django服务端要接收POST请求，需要支持csrf_exempt，但添加这个前置后，又无法获取POST参数了。
    if request.method == "POST":
        ajaxData = json.loads(str(request.body))#{"username":"asdf","pwd":"asdf"}
        username = ajaxData["username"]
        pwd = ajaxData["pwd"]
        if isExists(request,username) is False:
            newID = addUser(request,username,pwd)
        else:
            return HttpResponse("existUserName")

        return HttpResponse(newID)
    else:
        return HttpResponse("error")

def usersignin(request,name,pwd):
    try:
        theUser=User.objects.get(username=name,password=pwd)
    except User.DoesNotExist:
        return "failure"
    else:
        return theUser.user_ID

@csrf_exempt
def signin(request):
    if request.method == "POST":
        ajaxData = json.loads(str(request.body))
        username = ajaxData["username"]
        pwd = ajaxData["pwd"]
        uid=usersignin(request,username,pwd)
        return HttpResponse(uid)
    else:
        return HttpResponse("error")

def doPost(request,userID,types,content):
    if types=="text":
        thisPost=shareContent(
            author=User.objects.get(user_ID=userID),
            content_type=1,
            content_description=content)
        contentID=thisPost.save()

        thePost=shareContent.objects.get(content_ID=contentID)
        if not thePost:
            id="failure"
        else:
            id=contentID
        return id

@csrf_exempt
def post_text(request):
    if request.method == "POST":
        ajaxData = json.loads(str(request.body))
        userID = ajaxData["userID"]
        types = ajaxData["type"]
        text = ajaxData["text"]
        result=doPost(request,userID,types,text)
        return HttpResponse(result)
    else:
        return HttpResponse("error")

def searchUserByKeyword(request,keyword):
    #users = User.objects.filter(username__contains=keyword).order_by("-creation_date")
    return User.objects.filter(username__icontains=keyword).order_by("-creation_date").query.__str__()
    #serchedUser=list(users)
    #userJSON=serializers.serialize('json', serchedUser, fields=('user_ID', 'username', 'alias','password','image_url','signature','creation_date'))
    #return userJSON
    
    #sliderJSON=Slider_Content.objects.raw('SELECT (select count(*) from slider_DB_comment as c where c.to_slider_content_id = slider_DB_slider_content.slider_content_ID) AS comments_count, slider_DB_slider_content.slider_content_ID, slider_DB_slider_content.slider_nav_id, slider_DB_slider_content.sequenceNo, slider_DB_slider_content.slider_id, slider_DB_slider_content.slider_class, slider_DB_slider_content.slider_title, slider_DB_slider_content.dataX, slider_DB_slider_content.dataY, slider_DB_slider_content.dataZ, slider_DB_slider_content.data_skew, slider_DB_slider_content.data_rotate_x, slider_DB_slider_content.data_rotate_y, slider_DB_slider_content.data_rotate, slider_DB_slider_content.data_scale, slider_DB_slider_content.data_scale3d, slider_DB_slider_content.data_perspective, slider_DB_slider_content.syntax_highlighter, slider_DB_slider_content.context, slider_DB_slider_content.slider_memo FROM slider_DB_slider_content WHERE slider_DB_slider_content.slider_id = \'%s\' ORDER BY slider_DB_slider_content.sequenceNo ASC', [theslider.slider_ID])
    #listSliderJSON=list(sliderPage)
    #slider_JSON=serializers.serialize('json', listSliderJSON, fields=('comments_count', 'slider_content_ID', 'slider_nav_id','sequenceNo','slider_id','slider_class','slider_title','dataX','dataY','dataZ','data_skew','data_rotate_x','data_rotate_y','data_rotate','data_scale','data_scale3d','data_perspective','syntax_highlighter','context','slider_memo'))


@csrf_exempt
def searchUser(request):
    if request.method == "POST":
        ajaxData = json.loads(str(request.body))
        keyword = ajaxData["keyword"]
        result=searchUserByKeyword(request,keyword)
        return HttpResponse(result)
    else:
        return HttpResponse("error")