import unittest
from baseTest import *
from default import *
from parsingConfig import *

if __name__ == '__main__':
    try:
        unittest.main()
    except Exception as e:
        print(e)
        x = raw_input("Press any key to continue . . .")
        raise
