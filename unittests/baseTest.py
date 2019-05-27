import unittest
import re
import json
import time

try:
    from bs4 import BeautifulSoup
except ImportError as e:
    print(e)
    from pip._internal import main as _pip_main
    _pip_main(['install', 'BeautifulSoup4'])
    from bs4 import BeautifulSoup


try:
    from selenium import webdriver
except ImportError as e:
    print(e)
    from pip._internal import main as _pip_main
    _pip_main(['install', 'selenium'])
    from selenium import webdriver


class base(unittest.TestCase):
    url = 'http://localhost:1005'
    wait = 1

    @classmethod
    def setUpClass(cls):
        """
        """
        cls.driver = webdriver.Edge()
        cls.parser = BeautifulSoup

    @classmethod
    def tearDownClass(cls):
        cls.driver.close()

    def setUp(self):
        pass

    def tearDown(self):
        pass
