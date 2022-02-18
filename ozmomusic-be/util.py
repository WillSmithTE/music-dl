import pickle
import logging

def save(data, filename):
    file = open(filename, 'wb')
    pickle.dump(data, file)
    file.close()


def read(filename):
    try:
        file = open(filename, 'rb')
        data = pickle.load(file)
        file.close()
        return data
    except:
        logging.info('error reading file', exc_info=True)
        return None
