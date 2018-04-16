import datetime
import math
import pickle
import requests
import time

from datetime import timedelta

token = "eyJhbGciOiJSUzI1NiIsImtpZCI6ImxlZ2FjeS10b2tlbi1rZXkiLCJ0eXAiOiJKV1QifQ.eyJqdGkiOiI0NWRhZDAxZjM5NDA0ZDEwOTQ3ZGRkMDdiMTU3YTdkOCIsInN1YiI6InNkLmhhY2thdGhvbiIsInNjb3BlIjpbImllLWN1cnJlbnQuUFNELUlFLUlNQUdFLklFLUlNQUdFLkxJTUlURUQuREVWRUxPUCIsImllLWN1cnJlbnQuUFNELUlFLVRSQUZGSUMuSUUtVFJBRkZJQy5MSU1JVEVELkRFVkVMT1AiLCJpZS1jdXJyZW50LlNELUlFLVZJREVPLklFLVZJREVPLkxJTUlURUQuREVWRUxPUCIsInVhYS5yZXNvdXJjZSIsImllLWN1cnJlbnQuUFNELUlFLVBFREVTVFJJQU4uSUUtUEVERVNUUklBTi5MSU1JVEVELkRFVkVMT1AiLCJpZS1jdXJyZW50LlNELUlFLVBBUktJTkcuSUUtUEFSS0lORy5MSU1JVEVELkRFVkVMT1AiLCJpZS1jdXJyZW50LlNELUlFLUlNQUdFLklFLUlNQUdFLkxJTUlURUQuREVWRUxPUCIsImllLWN1cnJlbnQuUFNELUlFLVBBUktJTkcuSUUtUEFSS0lORy5MSU1JVEVELkRFVkVMT1AiLCJpZS1jdXJyZW50LlBTRC1JRS1WSURFTy5JRS1WSURFTy5MSU1JVEVELkRFVkVMT1AiLCJpZS1jdXJyZW50LlNELUlFLVRSQUZGSUMuSUUtVFJBRkZJQy5MSU1JVEVELkRFVkVMT1AiLCJpZS1jdXJyZW50LlNELUlFLUVOVklST05NRU5UQUwuSUUtRU5WSVJPTk1FTlRBTC5MSU1JVEVELkRFVkVMT1AiLCJpZS1jdXJyZW50LlBTRC1JRS1FTlZJUk9OTUVOVEFMLklFLUVOVklST05NRU5UQUwuTElNSVRFRC5ERVZFTE9QIiwiaWUtY3VycmVudC5TRC1JRS1QRURFU1RSSUFOLklFLVBFREVTVFJJQU4uTElNSVRFRC5ERVZFTE9QIl0sImNsaWVudF9pZCI6InNkLmhhY2thdGhvbiIsImNpZCI6InNkLmhhY2thdGhvbiIsImF6cCI6InNkLmhhY2thdGhvbiIsImdyYW50X3R5cGUiOiJjbGllbnRfY3JlZGVudGlhbHMiLCJyZXZfc2lnIjoiNWE0YzhlYyIsImlhdCI6MTUyMzczNjc5MCwiZXhwIjoxNTI0MzQxNTkwLCJpc3MiOiJodHRwczovLzYyNGVmZjAyLWRiYjEtNGM2Yy05MGJjLWZhODVhMjllNWZhOC5wcmVkaXgtdWFhLnJ1bi5hd3MtdXN3MDItcHIuaWNlLnByZWRpeC5pby9vYXV0aC90b2tlbiIsInppZCI6IjYyNGVmZjAyLWRiYjEtNGM2Yy05MGJjLWZhODVhMjllNWZhOCIsImF1ZCI6WyJpZS1jdXJyZW50LlNELUlFLUlNQUdFLklFLUlNQUdFLkxJTUlURUQiLCJpZS1jdXJyZW50LlBTRC1JRS1WSURFTy5JRS1WSURFTy5MSU1JVEVEIiwiaWUtY3VycmVudC5QU0QtSUUtVFJBRkZJQy5JRS1UUkFGRklDLkxJTUlURUQiLCJpZS1jdXJyZW50LlBTRC1JRS1QRURFU1RSSUFOLklFLVBFREVTVFJJQU4uTElNSVRFRCIsImllLWN1cnJlbnQuUFNELUlFLVBBUktJTkcuSUUtUEFSS0lORy5MSU1JVEVEIiwiaWUtY3VycmVudC5QU0QtSUUtRU5WSVJPTk1FTlRBTC5JRS1FTlZJUk9OTUVOVEFMLkxJTUlURUQiLCJpZS1jdXJyZW50LlNELUlFLVZJREVPLklFLVZJREVPLkxJTUlURUQiLCJpZS1jdXJyZW50LlNELUlFLVBBUktJTkcuSUUtUEFSS0lORy5MSU1JVEVEIiwiaWUtY3VycmVudC5TRC1JRS1UUkFGRklDLklFLVRSQUZGSUMuTElNSVRFRCIsImllLWN1cnJlbnQuUFNELUlFLUlNQUdFLklFLUlNQUdFLkxJTUlURUQiLCJ1YWEiLCJpZS1jdXJyZW50LlNELUlFLUVOVklST05NRU5UQUwuSUUtRU5WSVJPTk1FTlRBTC5MSU1JVEVEIiwiaWUtY3VycmVudC5TRC1JRS1QRURFU1RSSUFOLklFLVBFREVTVFJJQU4uTElNSVRFRCIsInNkLmhhY2thdGhvbiJdfQ.MLQncxbZmu1v9oW1-5l1E4HuP0HZvgIxtkPwYX1BpRglyCjgfTrVsM0FlAjWseKi00WpOy6kT7GCXQdKv1bM2FiW0Ql7RRnq_BA4sFTT2cOdiCUR7Tjmem5RSa6DhAOGhl6bihbsjva8saaeAZM1OvGIGYnlJRQwMxipA63nKo7NE6baHUPIIWQmOjh8kkorlimxUrSSvdrLWfAIUmZ2Sy0rdITkTfjV9lqX9f2_c6WOOjm-fCUkyk8gDGEODpW5P8CB2zSt6S8TBh0_nqCjg3nEzZzA8vTjFyewmoxCKBjmJcitWRKq_41QndgJ788R5TLB5X5Uo1xCDS5uEyKJsw"

metadataurl = "https://ic-metadata-service-sdhack.run.aws-usw02-pr.ice.predix.io/v2/metadata"
eventurl = "https://ic-event-service-sdhack.run.aws-usw02-pr.ice.predix.io/v2"

trees = {
 "oak" : {"height": 18.288, "radius": 7.9248},
 "pear" : {"height": 13.716, "radius": 6.096},
 "mulberry" : {"height": 9.144, "radius": 7.62}
}

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
        console.log('Invalid data {0}'.format(data))
        #raise ValueError(data)

    return res

# return the closest sensor
def get_closest_sensor(coords, target):
    closestPos = None
    minDis = -1

    for pos in coords:
        xDis = math.fabs(math.pow(float(pos[0]), 2) - math.pow(float(target[0]), 2))
        yDis = math.fabs(math.pow(float(pos[1]), 2) - math.pow(float(target[1]), 2))
        dis = math.sqrt(math.fabs(xDis - yDis))

        if ((minDis < 0) or (minDis > dis)):
            minDis = dis
            closestPos = pos

    return closestPos[2]

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

# returns average vehicle speed from a traffic json
def average_vehicles(data):
    total = 0

    for element in data:
        if 'measures' in element:
            if 'speed' in element['measures']:
                total += element['measures']['speed']
            if 'counter_direction_speed' in element['measures']:
                total += element['measures']['counter_direction_speed']

    return float(total) / len(data)

# returns average measure from an env json
def average_measure(data):
    total = 0
    power = 0.0

    for element in data:
        if 'measures' in element and 'properties' in element:

            if 'powerOf10' in element['properties']:
                power = float(element['properties']['powerOf10'])

            if 'median' in element['measures']:
                median = float(element['measures']['median'])
                scale = float(math.pow(10, power))
                total +=  scale * median

    return float(total) / len(data)

# helper functions to calculate tree water retention
def calc_e_delta(humidity, temperature):
    tmp = (7.5 * temperature) / (237.3 + temperature)
    S =  610.7 * math.pow(10, tmp)
    return S / 1000

def calc_delta(temperature):
    power = (17.27*temperature) / (temperature + 273.3)
    numerator = 4098 * (0.6108 * math.pow(math.e, power))
    denominator = math.pow(temperature + 237.3, 2)
    return numerator / denominator

# calculate evapotranspirtation in mm / day
def calc_evapotranspiration(humidity, temperature):
    e_delta = calc_e_delta(humidity, temperature)
    delta = calc_delta(temperature)
    gamma = 0.675
    U = 3.12928 # wind speed (m/s)
    numerator = (0.408 * delta) + (gamma * (900/(temperature+273)) * U * e_delta)
    denominator = delta + (gamma * (1 + 0.34 * U))

    return float(numerator) / denominator

# calculate % of water retained by the tree
def calc_water_retention(humidity, temperature):
    temperature = temperature - 273.15 # convert temperature to C
    humidity = int(humidity) # convert percentage to decimal
    evapotranspiration = calc_evapotranspiration(humidity, temperature)
    avg_rainfall = 300 # mm
    retention = math.fabs(1 - (evapotranspiration / avg_rainfall))

    return evapotranspiration

def calc_carbon_reduction(tree_type):
    if tree_type.lower() in trees:
        measurements = trees[tree_type.lower()]
        diameter = measurements['radius'] * 2
        height = measurements['height']

        total_weight = 0.15 * diameter * diameter * height
        green_weight = total_weight * 0.725
        carbon_weight = green_weight * 0.5

        carbon_reduction = carbon_weight * 3.6663
        return carbon_reduction / 10

    else:
        print('{0} is not supported'.format(tree_type))
        raise ValueError(tree_type)


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

# calculate environmental tree benefits
def get_env_benefits(startts, endts, sample_loc, debug=True):
    env_coords = get_asset_coords('ENV_SENSOR')
    closest_env_sensor = get_closest_sensor(env_coords, sample_loc)

    avg_temp = get_sensor_data(closest_env_sensor, 'TEMPERATURE', 'SD-IE-ENVIRONMENTAL', 
     startts, endts, average_measure, asset=True)

    avg_humidity = get_sensor_data(closest_env_sensor, 'HUMIDITY', 'SD-IE-ENVIRONMENTAL', 
     startts, endts, average_measure, asset=True)

    evapotranspiration = calc_water_retention(avg_humidity, avg_temp)
    carbon_reduction = calc_carbon_reduction(default_tree)

    if (debug):
        print('Closest env sensor {0}'.format(closest_env_sensor))
        print('Average temperature at {0}: {1} K'.format(closest_env_sensor, avg_temp))
        print('Average humidity at {0}: {1} %'.format(closest_env_sensor, avg_humidity))
        print('Water retained {0} %'.format(water_retention))
        print('Carbon reduced {0} lbs/year'.format(carbon_reduction))
        print()

    return (evapotranspiration, carbon_reduction)

# sum number of vehicles and average vehicle speed
def get_vehicle_benefits(startts, endts, sample_loc, debug=True):
    traffic_coords = get_sensor_coords('TRAFFIC_LANE')
    closest_traffic_sensor = get_closest_sensor(traffic_coords, sample_loc)

    total_vehicles = get_sensor_data(closest_traffic_sensor, 'TFEVT', 
     "SD-IE-TRAFFIC", startts, endts, sum_vehicles)

    average_speed = get_sensor_data(closest_traffic_sensor, 'TFEVT', 
     "SD-IE-TRAFFIC", startts, endts, average_vehicles)

    if (debug):
        print('Closest vehicle sensor {0}'.format(closest_traffic_sensor))
        print('Number of vehicles at {0}: {1}'.format(closest_traffic_sensor, total_vehicles))
        print('Avg vehicle speed at {0}: {1}'.format(closest_traffic_sensor, average_speed))
        print()

    return total_vehicles, average_speed

def get_pedestrian_benefits(startts, endts, sample_loc, debug=True):
    pedestrian_coords = get_sensor_coords('WALKWAY')
    closest_ped_sensor = get_closest_sensor(pedestrian_coords, sample_loc)

    total_peds = get_sensor_data(closest_ped_sensor, 'PEDEVT', 
     "SD-IE-PEDESTRIAN", startts, endts, sum_pedestrians)

    if (debug):
        print('Closest pedestrian sensor {0}'.format(closest_ped_sensor))
        print('Number of pedestrians at {0}: {1}'.format(closest_ped_sensor, total_peds))
        print()

    return total_peds

def calculate_tree_benefit_score(startts, endts, sample_loc, debug=True):
    # Pedestrian data
    total_peds = get_pedestrian_benefits(startts, endts, sample_loc, debug)

    # Traffic data
    total_vehicles, average_speed = \
     get_vehicle_benefits(startts, endts, sample_loc, debug)

    # Environmental data
    evapotranspiration, carbon_reduction = \
     get_env_benefits(startts, endts, sample_loc, debug)

    return total_peds - total_vehicles - evapotranspiration + \
     carbon_reduction - average_speed

# calculates the tree benefit score over multiple locations
def calculate_tree_benefit_grid(startts, endts, coords, output):
    print ('Calculating scores...\n')
    scores = []
    i = 0

    for point in coords:
        score = (calculate_tree_benefit_score(startts, endts, point, debug=False))
        scores.append(score)
        print ('{0} {1}'.format(i, score))
        i += 1

    print ('Number of scores: {0}\nAverage {1}\n'.format(len(scores), 
     (sum(scores)/len(scores))))

    pickle.dump(scores, open(output,'wb'))
    return scores

# debug a sample tree benefit score
def calculate_sample_score(startts, endts):
    sample_loc = [32.714111261546044,-117.16024169311527]
    print('start time {0} end time {1}\n'.format(startts, endts))
    calculate_tree_benefit_score(startts, endts, sample_loc, debug=True)

# read randomly generated points
def read_lat_long_points(filename):
    coords = []

    with open(filename, 'r') as f:
        for line in f:
            line = line.split(',')
            if len(line) > 3:
                coords.append([float(line[1]), float(line[3])])

    return coords

# var heatMapData = [
# {location: new google.maps.LatLng(37.782, -122.447), weight: 0.5},
# ];
def format_scores(scores_file, formatted, coords):
    scores = pickle.load(open(scores_file, 'rb'))

    assert len(coords) == len(scores)

    print ('Number of scores {0}'.format(len(scores)))
    print ('Average of scores {0}'.format(sum(scores)/len(scores)))
    total = sum(scores)
    scores_norm = [i/total for i in scores]
    print ('Average of scores {0}'.format(sum(scores_norm)/len(scores_norm)))
    
    with open(formatted, 'w') as f:
        f.write("var treeBenefitHeatmap = [")

        for score, point in zip(scores_norm[:-1], coords[:-1]):
            f.write("{{location : new google.maps.LatLng({0},{1}),weight: {2}}},\n"\
             .format(point[0],point[1],score*1000))

        score = scores_norm[len(scores_norm)-1]
        point = coords[len(coords)-1]

        f.write("{{location : new google.maps.LatLng({0},{1}),weight: {2}}}\n"\
             .format(point[0],point[1],score*1000))

        f.write("];\n")

def main():
    print ('Reading coordinates')
    coords = read_lat_long_points('random_points_sd.csv')
    print (len(coords))
    print ('{0}\n'.format(coords[0]))

    # API parameters
    yesterday = datetime.datetime.now() - timedelta(365)
    endts = int(time.time()*1000)
    startts = int(time.mktime(yesterday.timetuple())*1000)

    #calculate_sample_score(startts, endts)
    #calculate_tree_benefit_grid(startts, endts, coords, '100_scores.p')

    format_scores('100_scores.p','treeBenefitHeatmap.js',coords)
    

if __name__ == "__main__":
    main()

































