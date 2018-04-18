import datetime
import json
import math
import pickle
import requests
import time

from datetime import timedelta

token = "eyJhbGciOiJSUzI1NiIsImtpZCI6ImxlZ2FjeS10b2tlbi1rZXkiLCJ0eXAiOiJKV1QifQ.eyJqdGkiOiI0NWRhZDAxZjM5NDA0ZDEwOTQ3ZGRkMDdiMTU3YTdkOCIsInN1YiI6InNkLmhhY2thdGhvbiIsInNjb3BlIjpbImllLWN1cnJlbnQuUFNELUlFLUlNQUdFLklFLUlNQUdFLkxJTUlURUQuREVWRUxPUCIsImllLWN1cnJlbnQuUFNELUlFLVRSQUZGSUMuSUUtVFJBRkZJQy5MSU1JVEVELkRFVkVMT1AiLCJpZS1jdXJyZW50LlNELUlFLVZJREVPLklFLVZJREVPLkxJTUlURUQuREVWRUxPUCIsInVhYS5yZXNvdXJjZSIsImllLWN1cnJlbnQuUFNELUlFLVBFREVTVFJJQU4uSUUtUEVERVNUUklBTi5MSU1JVEVELkRFVkVMT1AiLCJpZS1jdXJyZW50LlNELUlFLVBBUktJTkcuSUUtUEFSS0lORy5MSU1JVEVELkRFVkVMT1AiLCJpZS1jdXJyZW50LlNELUlFLUlNQUdFLklFLUlNQUdFLkxJTUlURUQuREVWRUxPUCIsImllLWN1cnJlbnQuUFNELUlFLVBBUktJTkcuSUUtUEFSS0lORy5MSU1JVEVELkRFVkVMT1AiLCJpZS1jdXJyZW50LlBTRC1JRS1WSURFTy5JRS1WSURFTy5MSU1JVEVELkRFVkVMT1AiLCJpZS1jdXJyZW50LlNELUlFLVRSQUZGSUMuSUUtVFJBRkZJQy5MSU1JVEVELkRFVkVMT1AiLCJpZS1jdXJyZW50LlNELUlFLUVOVklST05NRU5UQUwuSUUtRU5WSVJPTk1FTlRBTC5MSU1JVEVELkRFVkVMT1AiLCJpZS1jdXJyZW50LlBTRC1JRS1FTlZJUk9OTUVOVEFMLklFLUVOVklST05NRU5UQUwuTElNSVRFRC5ERVZFTE9QIiwiaWUtY3VycmVudC5TRC1JRS1QRURFU1RSSUFOLklFLVBFREVTVFJJQU4uTElNSVRFRC5ERVZFTE9QIl0sImNsaWVudF9pZCI6InNkLmhhY2thdGhvbiIsImNpZCI6InNkLmhhY2thdGhvbiIsImF6cCI6InNkLmhhY2thdGhvbiIsImdyYW50X3R5cGUiOiJjbGllbnRfY3JlZGVudGlhbHMiLCJyZXZfc2lnIjoiNWE0YzhlYyIsImlhdCI6MTUyMzczNjc5MCwiZXhwIjoxNTI0MzQxNTkwLCJpc3MiOiJodHRwczovLzYyNGVmZjAyLWRiYjEtNGM2Yy05MGJjLWZhODVhMjllNWZhOC5wcmVkaXgtdWFhLnJ1bi5hd3MtdXN3MDItcHIuaWNlLnByZWRpeC5pby9vYXV0aC90b2tlbiIsInppZCI6IjYyNGVmZjAyLWRiYjEtNGM2Yy05MGJjLWZhODVhMjllNWZhOCIsImF1ZCI6WyJpZS1jdXJyZW50LlNELUlFLUlNQUdFLklFLUlNQUdFLkxJTUlURUQiLCJpZS1jdXJyZW50LlBTRC1JRS1WSURFTy5JRS1WSURFTy5MSU1JVEVEIiwiaWUtY3VycmVudC5QU0QtSUUtVFJBRkZJQy5JRS1UUkFGRklDLkxJTUlURUQiLCJpZS1jdXJyZW50LlBTRC1JRS1QRURFU1RSSUFOLklFLVBFREVTVFJJQU4uTElNSVRFRCIsImllLWN1cnJlbnQuUFNELUlFLVBBUktJTkcuSUUtUEFSS0lORy5MSU1JVEVEIiwiaWUtY3VycmVudC5QU0QtSUUtRU5WSVJPTk1FTlRBTC5JRS1FTlZJUk9OTUVOVEFMLkxJTUlURUQiLCJpZS1jdXJyZW50LlNELUlFLVZJREVPLklFLVZJREVPLkxJTUlURUQiLCJpZS1jdXJyZW50LlNELUlFLVBBUktJTkcuSUUtUEFSS0lORy5MSU1JVEVEIiwiaWUtY3VycmVudC5TRC1JRS1UUkFGRklDLklFLVRSQUZGSUMuTElNSVRFRCIsImllLWN1cnJlbnQuUFNELUlFLUlNQUdFLklFLUlNQUdFLkxJTUlURUQiLCJ1YWEiLCJpZS1jdXJyZW50LlNELUlFLUVOVklST05NRU5UQUwuSUUtRU5WSVJPTk1FTlRBTC5MSU1JVEVEIiwiaWUtY3VycmVudC5TRC1JRS1QRURFU1RSSUFOLklFLVBFREVTVFJJQU4uTElNSVRFRCIsInNkLmhhY2thdGhvbiJdfQ.MLQncxbZmu1v9oW1-5l1E4HuP0HZvgIxtkPwYX1BpRglyCjgfTrVsM0FlAjWseKi00WpOy6kT7GCXQdKv1bM2FiW0Ql7RRnq_BA4sFTT2cOdiCUR7Tjmem5RSa6DhAOGhl6bihbsjva8saaeAZM1OvGIGYnlJRQwMxipA63nKo7NE6baHUPIIWQmOjh8kkorlimxUrSSvdrLWfAIUmZ2Sy0rdITkTfjV9lqX9f2_c6WOOjm-fCUkyk8gDGEODpW5P8CB2zSt6S8TBh0_nqCjg3nEzZzA8vTjFyewmoxCKBjmJcitWRKq_41QndgJ788R5TLB5X5Uo1xCDS5uEyKJsw"

metadataurl = "https://ic-metadata-service-sdhack.run.aws-usw02-pr.ice.predix.io/v2/metadata"
eventurl = "https://ic-event-service-sdhack.run.aws-usw02-pr.ice.predix.io/v2"

DAYS_IN_YEAR = 365
DAYS_IN_WEEK = 7

# get coordinates of pedestrian sensors
def get_sensor_coords(type):
    url = "{0}/locations/search?q=locationType:{1}&page=0&size=200". \
     format(metadataurl, type)

    headers = {"Authorization":"Bearer {0}".format(token), 
     "Predix-Zone-Id": 'SD-IE-TRAFFIC'}

    data = requests.get(url, headers=headers).json()
    res = None

    if 'content' in data:
        data = data['content']
        res = []

        for location in data:
            locationUid = location['locationUid']
            coordinate = location['coordinates'].split(',')
            average = []

            if len(coordinate) <= 1:
                coordinate = coordinate.split(':')
                average = [float(coordinate[0]), float(coordinate[1])]

            elif len(coordinate) > 1:
                coord1 = coordinate[0].split(':')
                coord2 = coordinate[1].split(':')

                lat = (float(coord1[0]) + float(coord2[0])) / 2
                lon = (float(coord1[1]) + float(coord2[1])) / 2
                average = [lat, lon]

            average.append(locationUid)
            res.append(average)

    else:
        console.log('Invalid data {0}'.format(data))
        #raise ValueError(data)

    return res

# counts total number of pedestrians from a pedestrian json
def sum_pedestrians(data):
    total = 0

    for element in data:
        if 'measures' in element and 'pedestrianCount' in element['measures']:
            total += element['measures']['pedestrianCount']
    
    return total

# counts total number of vehicles from a traffic json
def sum_vehicles(data):
    total = 0

    for element in data:

        if 'measures' in element:

            if 'vehicleCount' in element['measures']:
                total += element['measures']['vehicleCount']

            if 'counter_direction_vehicleCount' in element['measures']:
                total += element['measures']['counter_direction_vehicleCount']

    return total

# makes the api request for the data
def request_sensor_data(url, zoneId, cb):
    try:
        data = requests.get(url, headers={
         "Authorization":"Bearer {0}".format(token), 

         "Predix-Zone-Id": zoneId,

         "Access-Control-Allow-Origin": "https://localhost:8090",

         "Access-Control-Allow-Credentials": "true",

         "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT",

         "Access-Control-Allow-Headers": "Access-Control-Allow-Headers, "+
          "Origin,Accept, X-Requested-With, " +
          "Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers",

         'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.11 '+
          '(KHTML, like Gecko) Chrome/23.0.1271.64 Safari/537.11'
        }).json()

        if 'content' in data:
            total = cb(data['content'])

        else:
            console.log('Invalid data {0}'.format(data))
            #raise ValueError(data)

    except:
        print('Request exception\n')

    return total

# constructs url and requests data from the api
def get_sensor_data(sensor, evtType, zoneId, startts, endts, cb, asset=False):
    if (asset):
        url = "{0}/assets/{1}/events?eventType={2}&startTime={3}&endTime={4}" \
         .format(eventurl,sensor,evtType,startts,endts)
        
        return request_sensor_data(url, zoneId, cb)

    else:
        url = "{0}/locations/{1}/events?eventType={2}&startTime={3}&endTime={4}" \
         .format(eventurl,sensor,evtType,startts,endts)

        return request_sensor_data(url, zoneId, cb)

def get_pedestrian_benefits(startts, endts, sensor, debug=True):
    total_peds = get_sensor_data(sensor, 'PEDEVT', 
     "SD-IE-PEDESTRIAN", startts, endts, sum_pedestrians)

    if (debug):
        print('Closest pedestrian sensor {0}'.format(sensor))
        print('Number of pedestrians at {0}: {1}'.format(sensor, total_peds))
        print()

    return total_peds

def main():
    # get a year's worth of pedestrian data
    i = 1
    coords = get_sensor_coords('WALKWAY')
    res = []
    f = open('ped_data.json','w')

    while (i >= 0):
        endDate = datetime.datetime.now() - timedelta(i-1)
        startDate = datetime.datetime.now() - timedelta(i)

        startts = int(time.mktime(startDate.timetuple())*1000)
        endts = int(time.time()*1000)

        print ('{0}: start {1} end {2}'.format(i,startDate,endDate))
        i -= 1 

        for pos in coords:
            total_peds = get_pedestrian_benefits(startts, endts, pos[2], False)
            print ('{0} pedestrians at sensor {1}'.format(total_peds, pos[2]))

            res.append({"localId":"{0}".format(pos[2]),
             "time":startts,
             "count":total_peds})

        print()

    print ('Total jsons {0}'.format(len(res)))
    print ('Sample {0}'.format(res[0]))
    json.dump(res, f, indent=4)

if __name__ == "__main__":
    main()

































