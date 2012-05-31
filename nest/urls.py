from django.conf.urls import patterns, url
from nest import cache

urlpatterns = patterns('',
    url(r'^store$', 'nest.views.store'),
    url(r'^get/(?P<parameterIds>(?:\w+,?)+)+/?$', 'nest.views.get'),
    url(r'^get/(?P<parameterIds>(?:\w+,?)+)+/(?P<rangeSpec>\w+)/(?P<rangeParam>[\w\-\.:,]+)$', 'nest.views.getrange'),
)
