import datetime
import json
import math
import pickle
import requests
import time

from datetime import timedelta
from Util import *
from Networks import *

DAYS_IN_YEAR = 365
DAYS_IN_MONTH = 31
DAYS_IN_WEEK = 7

def format_pedestrian_json(coords, startts, endts, aggregate, res):
    for pos in coords:
        total_peds = aggregate(startts, endts, sensor=pos[2], debug=False)

        if (total_peds != None):
            print ('{0} pedestrians at sensor {1}'.format(total_peds, pos[2]))

            res.append({"localId":"{0}".format(pos[2]),
             "time":startts,
             "count":total_peds})

def format_vehicle_json(coords, startts, endts, aggregate, res):
    for pos in coords:
        avg_vehicles, avg_speed = aggregate(startts, endts, sensor=pos[2], debug=False)

        if avg_vehicles != None and avg_speed != None:
            print ('{0} vehicles at sensor {1}'.format(avg_vehicles, pos[2]))
            print ('{0} vehicle speed at sensor {1}'.format(avg_speed, pos[2]))

            print()

            res.append({"localId":"{0}".format(pos[2]),
             "time":startts,
             "avgCount":avg_vehicles,
             "avgSpeed":avg_speed})

def format_env_json(coords, startts, endts, aggregate, res):
    for pos in coords:
        evapotranspiration, carbon_reduction = aggregate(startts, endts, sensor=pos[2], debug=False)
        print ('{0} evapotranspiration at sensor {1}'.format(evapotranspiration, pos[2]))
        print ('{0} carbon_reduction speed at sensor {1}'.format(carbon_reduction, pos[2]))
        print()

        res.append({"localId":"{0}".format(pos[2]),
         "time":startts,
         "evapotranspiration":evapotranspiration,
         "carbonReduction":carbon_reduction})

def create_jsons(sensor_type, filename, num_days, format_json, aggregate,asset=False):
    if (asset):
        coords = get_asset_coords(sensor_type)
    else:
        coords = get_sensor_coords(sensor_type)

    res = []
    f = open(filename,'w')

    while (num_days >= 1):
        endDate = datetime.datetime.now() - timedelta(num_days-1)
        startDate = datetime.datetime.now() - timedelta(num_days)

        startts = int(time.mktime(startDate.timetuple())*1000)
        endts = int(time.time()*1000)

        print ('{0}: start {1} end {2}'.format(num_days,startDate,endDate))
        num_days -= 1 

        format_json(coords, startts, endts, aggregate, res)

        print()

    print ('Total jsons {0}'.format(len(res)))
    print ('Sample {0}'.format(res[0]))
    json.dump(res, f, indent=4)

def main():
    create_jsons('WALKWAY', 'jsons/test.json', 
     DAYS_IN_MONTH, format_pedestrian_json, get_pedestrian_benefits)

    create_jsons('TRAFFIC_LANE', 'jsons/vehicle_data_monthly.json', 
     DAYS_IN_MONTH, format_vehicle_json, get_vehicle_benefits)

    create_jsons('ENV_SENSOR', 'jsons/env_data_monthly.json', 
     DAYS_IN_MONTH, format_env_json, get_env_benefits,asset=True)

if __name__ == "__main__":
    main()

































