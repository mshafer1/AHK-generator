import unittest
from baseTest import base
import time


class TestComment(base):
    page = '/?length=1&comment0=test+comment&func0=KEY&skey0%5B%5D=CTRL&skey0%5B%5D=ALT&skeyValue0=i&Window0=ahk_exe&Program0=chrome.exe&option0=ActivateOrOpen'

    @classmethod
    def setUpClass(cls):
        """ get_some_resource() is slow, to avoid calling it for each test use setUpClass()
            and store the result as class variable
        """
        super(TestComment, cls).setUpClass()
        cls.driver.get(base.url + TestComment.page)
        time.sleep(cls.wait)  # allow driver time to load page

    def setUp(self):
        super(TestComment, self).setUp()

    def test_has_row(self):
        print "Test: has row"
        htmlSource = self.driver.page_source

        parsed_html = self.parser(htmlSource)
        # print [x for x in dir(parsed_html.body.find('div', attrs={'id': 'shortcut0'})) if '_' not in x]
        hotkey_row = parsed_html.body.find('div', attrs={'id': 'shortcut0'})
        self.assertNotEquals(None, hotkey_row)
        # print htmlSource

    def test_hasComment(self):
        print "Test: has comment"
        htmlSource = self.driver.page_source

        parsed_html = self.parser(htmlSource)
        # print [x for x in dir(parsed_html.body.find('div', attrs={'id': 'shortcut0'})) if '_' not in x]
        comment = parsed_html.body.find('input', attrs={'id': 'comment0'})
        self.assertNotEquals(None, comment)

        self.assertEqual("test comment", comment.get('value'))
        # print htmlSource