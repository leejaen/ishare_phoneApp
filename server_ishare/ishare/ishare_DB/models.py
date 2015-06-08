# -*- coding: utf-8 -*-
import hashlib
import random
from django.db import models
import datetime

# Create your models here.
class User(models.Model):
    """自身注册用户"""
    user_ID = models.CharField(primary_key=True, max_length=40)#使用自定主键
    username = models.CharField(max_length=20, db_index=True,verbose_name='用户名')
    alias = models.CharField(max_length=20, db_index=True,verbose_name='别名')
    password = models.CharField(max_length=40,verbose_name='密码')
    image_url = models.CharField(max_length=200,blank=True,verbose_name='照片路径')
    signature = models.CharField(max_length=100,blank=True,verbose_name='个性签名')
    creation_date = models.DateTimeField(verbose_name='创建时间')
    def save(self, *args, **kwargs):#for guid Field, thanks for
                                    #http://stackoverflow.com/questions/894595/is-there-any-way-to-use-guids-in-django
        if not self.user_ID:
            self.user_ID = hashlib.sha1(str(random.random())).hexdigest()
        if not self.creation_date:
            self.creation_date = datetime.datetime.now()
        if not self.image_url:
            self.image_url = "http://121.40.209.230/static/avatar/default_avatar.png"
        super(User, self).save(*args, **kwargs)
    class Meta:
        verbose_name = "注册用户"
        verbose_name_plural = "注册用户"

class shareContent(models.Model):
    '''共享内容'''
    content_ID = models.CharField(primary_key=True, max_length=40)#使用自定主键
    author = models.ForeignKey('User',related_name = 'Author',verbose_name='作者', null=False)
    content_type = models.IntegerField(null=False,blank=False,verbose_name='类型（1文字，2图片，3声音，4……）')
    content_url = models.CharField(max_length=200,blank=True,verbose_name='照片路径')
    content_description = models.CharField(max_length=800,blank=True,verbose_name='描述')
    creation_date = models.DateTimeField(verbose_name='创建时间')
    def save(self, *args, **kwargs):#for guid Field, thanks for
                                    #http://stackoverflow.com/questions/894595/is-there-any-way-to-use-guids-in-django
        if not self.content_ID:
            self.content_ID = hashlib.sha1(str(random.random())).hexdigest()
        if not self.creation_date:
            self.creation_date = datetime.datetime.now()
        super(shareContent, self).save(*args, **kwargs)
        return self.content_ID;
    class Meta:  
        verbose_name = "内容"
        verbose_name_plural = "内容"
        ordering = ['creation_date'] # 按创建时间升序排列
