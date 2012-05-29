from django.conf.urls import patterns, url

urlpatterns = patterns('',
    url(r'^store$', 'nest.views.store'),
    url(r'^get/(?P<parameterIds>(?:\w+,?)+)+', 'nest.views.get'),
)
