from django.core.cache import cache
from django.utils import simplejson
import logging

log = logging.getLogger(__name__)

def store(raw):
    parameterGroup = simplejson.loads(raw)
    
    parameters = parameterGroup['org.hbird.core.spacesystemmodel.tmtcgroups.HummingbirdParameterGroup']['parameters']['entry']
    
    for param in parameters:
        log.info("process")
        pData = param['org.hbird.core.spacesystemmodel.parameters.HummingbirdParameter']
        pName = pData['name']
        pTime = pData['receivedTime']
        pValue = float(pData['value']['$'])
        
        
        cache.add(pName, [])
        cachedList = cache.get(pName)
        cachedList.append({
                           'receivedTime' : pTime,
                           'value' : pValue
                           })
        cache.set(pName, cachedList[-500:])
    
def getAll(pNames):
    tmData = {}
    
    for pName in pNames :
        cacheData = cache.get(pName)

        if cacheData :
            tmData[pName] = cacheData
        else :
            log.info("Received request for non-existent TM parameter: " + pName)

        return tmData


# Get the parameter values later than the given timestamp
def getsince(pNames, sinceLimits):
    tmData = {}
    
    for pName in pNames :
        cacheData = cache.get(pName)
    
        if cacheData :
            log.info(long(sinceLimits[0]))
            tmData[pName] = cacheData
        else :
            log.info("Received request for non-existent TM parameter: " + pName)
    
    return tmData


# Return the last X values for the specified parameter names
def getlast(pNames, count):
    tmData = {}
    
    for pName in pNames :
        cacheData = cache.get(pName)
    
        if cacheData :
            tmData[pName] = cacheData[-count:]
        else :
            log.info("Received request for non-existent TM parameter: " + pName)
    
    return tmData

# Return all values for the specified parameter names between the given timestamps
def getbetween(pNames, timestamps):
    tmData = {}
    return tmData
