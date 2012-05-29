# Create your views here.
from django.http import HttpResponse, HttpResponseBadRequest
from django.utils import simplejson
from django.utils.datetime_safe import datetime
import random

def store(request):
    if request.method == 'POST':
        # Save the POST data object to the queue
        return HttpResponse("Store")
    else:
        return HttpResponseBadRequest("ERROR: Request data must be POSTed")

def get(request, parameterIds):
    params = parameterIds.split(',')
    rspData = {}
    
    for param in params:
        # This will retrieve data from the nest.cache api
        rspData[param] = {
                          "time": datetime.now().isoformat(),
                          "data": random.random()
                          }
    
    return HttpResponse(simplejson.dumps(rspData), mimetype='application/json')
