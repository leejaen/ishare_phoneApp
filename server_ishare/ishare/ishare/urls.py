# -*- coding: utf-8 -*-
from django.conf.urls import patterns, include, url
from ishare.views import *

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'ishare.views.home', name='home'),
    # url(r'^ishare/', include('ishare.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),
	url('^$', 'ishare.views.defalut',name='indexPage'),#for http://127.0.0.1:8000/
	url('^signup/$','ishare.views.signup',name='signup'),#ajax sign up
    url('^signin/$','ishare.views.signin',name='signin'),#ajax sign in
    url('^post_text/$','ishare.views.post_text',name='post_text'),#ajax sign in
    url('^search_user/$','ishare.views.searchUser',name='searchUser'),#ajax sign in
)
