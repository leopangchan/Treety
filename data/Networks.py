# Handles making REST requests to the city's API

import requests
from Util import *

metadataurl = "https://ic-metadata-service-sdhack.run.aws-usw02-pr.ice.predix.io/v2/metadata"
eventurl = "https://ic-event-service-sdhack.run.aws-usw02-pr.ice.predix.io/v2"
token = "eyJhbGciOiJSUzI1NiIsImtpZCI6ImxlZ2FjeS10b2tlbi1rZXkiLCJ0eXAiOiJKV1QifQ.eyJqdGkiOiI0NWRhZDAxZjM5NDA0ZDEwOTQ3ZGRkMDdiMTU3YTdkOCIsInN1YiI6InNkLmhhY2thdGhvbiIsInNjb3BlIjpbImllLWN1cnJlbnQuUFNELUlFLUlNQUdFLklFLUlNQUdFLkxJTUlURUQuREVWRUxPUCIsImllLWN1cnJlbnQuUFNELUlFLVRSQUZGSUMuSUUtVFJBRkZJQy5MSU1JVEVELkRFVkVMT1AiLCJpZS1jdXJyZW50LlNELUlFLVZJREVPLklFLVZJREVPLkxJTUlURUQuREVWRUxPUCIsInVhYS5yZXNvdXJjZSIsImllLWN1cnJlbnQuUFNELUlFLVBFREVTVFJJQU4uSUUtUEVERVNUUklBTi5MSU1JVEVELkRFVkVMT1AiLCJpZS1jdXJyZW50LlNELUlFLVBBUktJTkcuSUUtUEFSS0lORy5MSU1JVEVELkRFVkVMT1AiLCJpZS1jdXJyZW50LlNELUlFLUlNQUdFLklFLUlNQUdFLkxJTUlURUQuREVWRUxPUCIsImllLWN1cnJlbnQuUFNELUlFLVBBUktJTkcuSUUtUEFSS0lORy5MSU1JVEVELkRFVkVMT1AiLCJpZS1jdXJyZW50LlBTRC1JRS1WSURFTy5JRS1WSURFTy5MSU1JVEVELkRFVkVMT1AiLCJpZS1jdXJyZW50LlNELUlFLVRSQUZGSUMuSUUtVFJBRkZJQy5MSU1JVEVELkRFVkVMT1AiLCJpZS1jdXJyZW50LlNELUlFLUVOVklST05NRU5UQUwuSUUtRU5WSVJPTk1FTlRBTC5MSU1JVEVELkRFVkVMT1AiLCJpZS1jdXJyZW50LlBTRC1JRS1FTlZJUk9OTUVOVEFMLklFLUVOVklST05NRU5UQUwuTElNSVRFRC5ERVZFTE9QIiwiaWUtY3VycmVudC5TRC1JRS1QRURFU1RSSUFOLklFLVBFREVTVFJJQU4uTElNSVRFRC5ERVZFTE9QIl0sImNsaWVudF9pZCI6InNkLmhhY2thdGhvbiIsImNpZCI6InNkLmhhY2thdGhvbiIsImF6cCI6InNkLmhhY2thdGhvbiIsImdyYW50X3R5cGUiOiJjbGllbnRfY3JlZGVudGlhbHMiLCJyZXZfc2lnIjoiNWE0YzhlYyIsImlhdCI6MTUyMzczNjc5MCwiZXhwIjoxNTI0MzQxNTkwLCJpc3MiOiJodHRwczovLzYyNGVmZjAyLWRiYjEtNGM2Yy05MGJjLWZhODVhMjllNWZhOC5wcmVkaXgtdWFhLnJ1bi5hd3MtdXN3MDItcHIuaWNlLnByZWRpeC5pby9vYXV0aC90b2tlbiIsInppZCI6IjYyNGVmZjAyLWRiYjEtNGM2Yy05MGJjLWZhODVhMjllNWZhOCIsImF1ZCI6WyJpZS1jdXJyZW50LlNELUlFLUlNQUdFLklFLUlNQUdFLkxJTUlURUQiLCJpZS1jdXJyZW50LlBTRC1JRS1WSURFTy5JRS1WSURFTy5MSU1JVEVEIiwiaWUtY3VycmVudC5QU0QtSUUtVFJBRkZJQy5JRS1UUkFGRklDLkxJTUlURUQiLCJpZS1jdXJyZW50LlBTRC1JRS1QRURFU1RSSUFOLklFLVBFREVTVFJJQU4uTElNSVRFRCIsImllLWN1cnJlbnQuUFNELUlFLVBBUktJTkcuSUUtUEFSS0lORy5MSU1JVEVEIiwiaWUtY3VycmVudC5QU0QtSUUtRU5WSVJPTk1FTlRBTC5JRS1FTlZJUk9OTUVOVEFMLkxJTUlURUQiLCJpZS1jdXJyZW50LlNELUlFLVZJREVPLklFLVZJREVPLkxJTUlURUQiLCJpZS1jdXJyZW50LlNELUlFLVBBUktJTkcuSUUtUEFSS0lORy5MSU1JVEVEIiwiaWUtY3VycmVudC5TRC1JRS1UUkFGRklDLklFLVRSQUZGSUMuTElNSVRFRCIsImllLWN1cnJlbnQuUFNELUlFLUlNQUdFLklFLUlNQUdFLkxJTUlURUQiLCJ1YWEiLCJpZS1jdXJyZW50LlNELUlFLUVOVklST05NRU5UQUwuSUUtRU5WSVJPTk1FTlRBTC5MSU1JVEVEIiwiaWUtY3VycmVudC5TRC1JRS1QRURFU1RSSUFOLklFLVBFREVTVFJJQU4uTElNSVRFRCIsInNkLmhhY2thdGhvbiJdfQ.MLQncxbZmu1v9oW1-5l1E4HuP0HZvgIxtkPwYX1BpRglyCjgfTrVsM0FlAjWseKi00WpOy6kT7GCXQdKv1bM2FiW0Ql7RRnq_BA4sFTT2cOdiCUR7Tjmem5RSa6DhAOGhl6bihbsjva8saaeAZM1OvGIGYnlJRQwMxipA63nKo7NE6baHUPIIWQmOjh8kkorlimxUrSSvdrLWfAIUmZ2Sy0rdITkTfjV9lqX9f2_c6WOOjm-fCUkyk8gDGEODpW5P8CB2zSt6S8TBh0_nqCjg3nEzZzA8vTjFyewmoxCKBjmJcitWRKq_41QndgJ788R5TLB5X5Uo1xCDS5uEyKJsw"

default_tree = "oak"

def get_asset_coords(assetType):
    res = []

    url = "{0}/assets/search?page=0&q=assetType:{1}". \
     format(metadataurl, assetType)

    headers = {"Authorization":"Bearer {0}".format(token), 
     "Predix-Zone-Id": "SD-IE-ENVIRONMENTAL"}

    data = requests.get(url, headers=headers).json()
    if 'content' in data:
        data = data['content']
        for location in data:
            coord = location['coordinates'].split(':')
            assetUid = location['assetUid']
            res.append([float(coord[0]),float(coord[1]),assetUid])

    else:
        console.log('Invalid data {0}'.format(data))
        #raise ValueError(data)

    return res

# get coordinates of sensors of type
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
        print('Invalid data {0}'.format(data))
        #raise ValueError(data)

    return res

# makes the api request for the data
def request_sensor_data(url, zoneId, cb):
    total = None
    
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
            print('Invalid data {0}'.format(data))
            #raise ValueError(data)

    except Exception as e:
        print(str(e))

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

def get_pedestrian_benefits(startts, endts, loc=None, sensor=None, debug=True):
    if (sensor == None and loc != None):
        coords = get_sensor_coords('WALKWAY')
        sensor = get_closest_sensor(coords, loc)

    average_peds = get_sensor_data(sensor, 'PEDEVT', \
    "SD-IE-PEDESTRIAN", startts, endts, average_pedestrian_count)

    if (debug):
        print('Closest pedestrian sensor {0}'.format(sensor))
        print('Number of pedestrians at {0}: {1}'.format(sensor, average_peds))
        print()

    return average_peds

def get_vehicle_benefits(startts, endts, loc=None, sensor=None, debug=True):
    if (sensor == None and loc != None):
        coords = get_sensor_coords('TRAFFIC_LANE')
        sensor = get_closest_sensor(coords, loc)

    avg_vehicles = get_sensor_data(sensor, 'TFEVT', \
     "SD-IE-TRAFFIC", startts, endts, average_vehicle_count)

    avg_speed = get_sensor_data(sensor, 'TFEVT', \
     "SD-IE-TRAFFIC", startts, endts, average_vehicle_speed)

    if (debug):
        print('Closest vehicle sensor {0}'.format(sensor))
        print('Number of vehicles at {0}: {1}'.format(sensor, avg_vehicles))
        print('Avg vehicle speed at {0}: {1}'.format(sensor, avg_speed))
        print()

    return avg_vehicles, avg_speed

# calculate environmental tree benefits
def get_env_benefits(startts, endts, loc=None, sensor=None, debug=True):
    if (sensor == None and loc != None):
        env_coords = get_asset_coords('ENV_SENSOR')
        sensor = get_closest_sensor(env_coords, loc)

    avg_temp = get_sensor_data(sensor, 'TEMPERATURE', 'SD-IE-ENVIRONMENTAL', \
     startts, endts, average_measure, asset=True)

    avg_humidity = get_sensor_data(sensor, 'HUMIDITY', 'SD-IE-ENVIRONMENTAL', \
     startts, endts, average_measure, asset=True)

    evapotranspiration = calc_water_retention(avg_humidity, avg_temp)
    carbon_reduction = calc_carbon_reduction(default_tree)

    if (debug):
        print('Closest env sensor {0}'.format(sensor))
        print('Average temperature at {0}: {1} K'.format(sensor, avg_temp))
        print('Average humidity at {0}: {1} %'.format(sensor, avg_humidity))
        print('Evapotranspiration {0} %'.format(evapotranspiration))
        print('Carbon reduced {0} lbs/year'.format(carbon_reduction))
        print()

    return (evapotranspiration, carbon_reduction)
