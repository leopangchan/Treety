import math

trees = {
 "oak" : {"height": 18.288, "radius": 7.9248},
 "pear" : {"height": 13.716, "radius": 6.096},
 "mulberry" : {"height": 9.144, "radius": 7.62}
}

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

    if len(data) > 0:
        for element in data:
            if 'measures' in element and 'pedestrianCount' in element['measures']:
                total += element['measures']['pedestrianCount']
    
    return total

# counts total number of vehicles from a traffic json
def sum_vehicles(data):
    total = 0

    if len(data) > 0:
        for element in data:

            if 'measures' in element:

                if 'vehicleCount' in element['measures']:
                    total += element['measures']['vehicleCount']

                if 'counter_direction_vehicleCount' in element['measures']:
                    total += element['measures']['counter_direction_vehicleCount']

    return total

def average_pedestrian_count(data):
    total = 0

    if len(data) > 0:
        for element in data:
            if 'measures' in element and 'pedestrianCount' in element['measures']:
                total += element['measures']['pedestrianCount']
    
        return float(total) / len(data)

    return total

# returns average vehicle speed from a traffic json
def average_vehicle_speed(data):
    total = 0

    if len(data) > 0:
        for element in data:
            if 'measures' in element:
                if 'speed' in element['measures']:
                    total += element['measures']['speed']
                if 'counter_direction_speed' in element['measures']:
                    total += element['measures']['counter_direction_speed']

        return float(total) / len(data)

    return total

# counts total number of vehicles from a traffic json
def average_vehicle_count(data):
    total = 0

    if len(data) > 0:
        for element in data:

            if 'measures' in element:

                if 'vehicleCount' in element['measures']:
                    total += element['measures']['vehicleCount']

                if 'counter_direction_vehicleCount' in element['measures']:
                    total += element['measures']['counter_direction_vehicleCount']

        return float(total) / len(data)

    return total

# returns average measure from an env json
def average_measure(data):
    total = 0
    power = 0.0

    if len(data) > 0:
        for element in data:
            if 'measures' in element and 'properties' in element:

                if 'powerOf10' in element['properties']:
                    power = float(element['properties']['powerOf10'])

                if 'median' in element['measures']:
                    median = float(element['measures']['median'])
                    scale = float(math.pow(10, power))
                    total +=  scale * median

        return float(total) / len(data)

    return total

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
