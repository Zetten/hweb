from django.conf.urls import patterns, include, url
from django.views.generic.simple import redirect_to

# Uncomment the next two lines to enable the admin:
#from django.contrib import admin

#admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    url(r'^/?$', redirect_to, {'url': '/swift/'}),
    url(r'^swift/', include('swift.urls')),
    url(r'^nest/', include('nest.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),
)
