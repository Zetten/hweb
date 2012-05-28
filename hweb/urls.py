from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
from django.views.generic.simple import redirect_to
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    url(r'^/?$', redirect_to, {'url': '/swift/'}),
    url(r'^swift/', include('swift.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
)
