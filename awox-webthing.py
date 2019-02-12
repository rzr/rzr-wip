from webthing import (Action, Event, Property, SingleThing, Thing, Value, WebThingServer)

import logging
import time
import uuid


import logging
logger = logging.getLogger("awoxmeshlight")
logger.setLevel(logging.DEBUG)
handler = logging.StreamHandler ()
handler.setLevel(logging.DEBUG)
logger.addHandler (handler)

# https://github.com/Leiaz/python-awox-mesh-light/blob/master/awoxmeshlight/__init__.py
import awoxmeshlight
mac = 'A4:C1:FF:FF:FF:FF' # Light
name = "PixtxaLightNet"
passwd = "IeY3johvoosh"
key = "4556572782865925"
mylight = awoxmeshlight.AwoxMeshLight(mac)
mylight.connect() # Unless specified, the default name and password are used
mylight.setMesh(name, passwd, key)


port = 59090

def setColor(hexcode):
    print('hex')
    print(hexcode)
    print(str(hexcode))
    #   0xFF0000

    r = hexcode[1:3]
    r = "0x%s" % str(r)
    r = int(r,16)

    g = hexcode[3:5]
    g = "0x%s" % str(g)
    g = int(g,16)

    b = hexcode[5:7]
    b = "0x%s" % str(b)
    b = int(b,16)

    print(r)
    print(g)
    print(b)

    try:
        mylight.setColor(r,g,b)
    except(e):
        print('excep')
        
    # g = hexcode[4:-2];
    # b = hexcode[6:];
    #    int("0x%s" % str(r)),
    #                    int("0x%s" % str(g)),
    #                   int("0x%s" % str(b))
    

def make_thing():
    thing = Thing('My Lamp', ['OnOffSwitch', 'Light'], 'A web connected lamp')

    thing.add_property(
        Property(thing,
                 'on',
                 Value(True),
                 metadata={
                     '@type': 'OnOffProperty',
                     'label': 'On/Off',
                     'type': 'boolean',
                     'description': 'Whether the lamp is turned on',
                 }))
    thing.add_property(
        Property(thing,
                 'brightness',
                 Value(50),
                 metadata={
                     '@type': 'BrightnessProperty',
                     'label': 'Brightness',
                     'type': 'number',
                     'description': 'The level of light from 0-100',
                     'minimum': 0,
                     'maximum': 100,
                     'unit': 'percent',
                 }))

    thing.add_property(
        Property(thing,
                 'color',
                 Value('#FFFFFF', lambda v: setColor(v)),
                 metadata={
                     '@type': 'ColorProperty',
                     'label': 'Color',
                     'type': 'string',
                     'description': 'Color of light',
                 }))


    return thing


def run_server():
    thing = make_thing()

    # If adding more than one thing, use MultipleThings() with a name.
    # In the single thing case, the thing's name will be broadcast.
    server = WebThingServer(SingleThing(thing), port=59090)
    try:
        logging.info('starting the server')
        server.start()
    except KeyboardInterrupt:
        logging.info('stopping the server')
        server.stop()
        logging.info('done')


if __name__ == '__main__':
    logging.basicConfig(
        level=10,
        format="%(asctime)s %(filename)s:%(lineno)s %(levelname)s %(message)s"
    )
    run_server()
