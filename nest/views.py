# Create your views here.
from django.http import HttpResponse, HttpResponseBadRequest
from django.utils import simplejson
from django.views.decorators.csrf import csrf_exempt
from nest import cache
import logging

log = logging.getLogger(__name__)

@csrf_exempt
def store(request):
    if request.method == 'POST' and request.META['CONTENT_TYPE'] == 'application/json':
        cache.store(request.raw_post_data)
        return HttpResponse("Stored data in cache")
    else:
        log.info("Received request of type " + request.method + " and content_type " + request.META['CONTENT_TYPE'])
        return HttpResponseBadRequest("ERROR: Request data must be POSTed in JSON format")

def get(request, parameterIds):
    pNames = parameterIds.split(',')
    rspData = cache.getAll(pNames)
    return HttpResponse(simplejson.dumps(rspData), mimetype='application/json')

def getrange(request, parameterIds, rangeSpec, rangeParam):
    pNames = parameterIds.split(',')
    
    # Possible rangeSpecs, with appropriate rangeParams, are:
    # since timestamp
    # between timestamp,timestamp
    # last count
    if rangeSpec.lower() == 'since' :
        sinceLimits = rangeParam.split(',')
        rspData = cache.getsince(pNames, sinceLimits)
        return HttpResponse(simplejson.dumps(rspData), mimetype='application/json')
    elif rangeSpec.lower() == 'last' :
        rspData = cache.getlast(pNames, int(rangeParam))
        return HttpResponse(simplejson.dumps(rspData), mimetype='application/json')
    elif rangeSpec.lower() == 'between' :
        rangeTimes = rangeParam.split(',')
        rspData = cache.getbetween(pNames, rangeTimes)
        return HttpResponse(simplejson.dumps(rspData), mimetype='application/json')
    else :
        return HttpResponseBadRequest("ERROR: An invalid range specifier or parameter was given")
