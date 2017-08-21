import unittest
import re
import json
from selenium import webdriver
import time

try:
    from BeautifulSoup import BeautifulSoup
except ImportError as e:
    print e
    import pip
    pip.main(['install', 'beautifulsoup'])
    from BeautifulSoup import BeautifulSoup

class base(unittest.TestCase):
    url = 'http://localhost:1002/'
    wait = 1

    @classmethod
    def setUpClass(cls):
        """
        """
        cls.driver = webdriver.Ie()
        cls.parser = BeautifulSoup

    @classmethod
    def tearDownClass(cls):
        cls.driver.close()

    def setUp(self):
        pass

    def tearDown(self):
        pass
