import unittest
from baseTest import base
import time

page = '/?length=1&comment0=test+comment&func0=KEY&skey0%5B%5D=CTRL&skey0%5B%5D=ALT&skeyValue0=i&Window0=ahk_exe&Program0=chrome.exe&option0=ActivateOrOpen'
class TestComment(base):
	
    @classmethod
    def setUpClass(cls):
        """ get_some_resource() is slow, to avoid calling it for each test use setUpClass()
            and store the result as class variable
        """
        super(TestComment, cls).setUpClass()
        cls.driver.get(base.url + page)
        time.sleep(cls.wait)  # allow driver time to load page

    def setUp(self):
        super(TestComment, self).setUp()
        print "Test config parse ---"

    def test_has_row(self):
        print "\tTest: has row"
        htmlSource = self.driver.page_source

        parsed_html = self.parser(htmlSource)
        # print [x for x in dir(parsed_html.body.find('div', attrs={'id': 'shortcut0'})) if '_' not in x]
        hotkey_row = parsed_html.body.find('div', attrs={'id': 'shortcut0'})
        self.assertNotEquals(None, hotkey_row)
        # print htmlSource

    def test_hasComment(self):
        print "\tTest: has comment"
        htmlSource = self.driver.page_source

        parsed_html = self.parser(htmlSource)
        # print [x for x in dir(parsed_html.body.find('div', attrs={'id': 'shortcut0'})) if '_' not in x]
        comment = parsed_html.body.find('input', attrs={'id': 'comment0'})
        self.assertNotEquals(None, comment)

        ### can't get comment text box value for some reason
        #self.assertEqual("test comment", comment.get('value'))
        # print htmlSource
      
      
    def test_downloadEnabled(self):
        print "\tTest: Download disabled"
        htmlSource = self.driver.page_source

        parsed_html = self.parser(htmlSource)
        download_btn = self.driver.find_element_by_id('btnDownload')
        # download_btn = parsed_html.body.find('button', attrs={'id': 'btnDownload'})
        self.assertNotEquals(None, download_btn)

        enabled = download_btn.is_enabled()
        print enabled
        self.assertEqual(True, enabled)
      
    def test_submitDisabled(self):
        print "\tTest: Submit disabled"
        htmlSource = self.driver.page_source

        parsed_html = self.parser(htmlSource)
        submit_btn = self.driver.find_element_by_id('btnSubmit')
        self.assertNotEquals(None, submit_btn)

        enabled = submit_btn.is_enabled()
        print enabled
        self.assertEqual(False, enabled)

class TestAddRow(base):
    def setUp(self):
        super(TestAddRow, self).setUp()
        print "\tTesting second row"
        self.driver.get(self.url + page)
        time.sleep(self.wait)  # allow driver time to load page

        self.driver.find_element_by_id('btnAdd').click()

        htmlSource = self.driver.page_source

        parsed_html = self.parser(htmlSource)
        # print [x for x in dir(parsed_html.body.find('div', attrs={'id': 'shortcut0'})) if '_' not in x]
        hotkey_row = parsed_html.body.find('div', attrs={'id': 'shortcut1'})
        self.assertNotEquals(None, hotkey_row)

    def tearDown(self):
        print "Testing: remove row"
        self.driver.get(self.url + page)
        time.sleep(self.wait)  # allow driver time to load page

        self.driver.find_element_by_id('destroy0').click()

        htmlSource = self.driver.page_source

        parsed_html = self.parser(htmlSource)
        # print [x for x in dir(parsed_html.body.find('div', attrs={'id': 'shortcut0'})) if '_' not in x]
        hotkey_row = parsed_html.body.find('div', attrs={'id': 'shortcut1'})
        self.assertEquals(None, hotkey_row)
        super(TestAddRow, self).tearDown()


class TestSecondRow(TestAddRow):
    def test_hasrow(self):
        print "\tTest: has row"
        htmlSource = self.driver.page_source

        parsed_html = self.parser(htmlSource)
        # print [x for x in dir(parsed_html.body.find('div', attrs={'id': 'shortcut0'})) if '_' not in x]
        hotkey_row = parsed_html.body.find('div', attrs={'id': 'shortcut1'})
        self.assertNotEquals(None, hotkey_row)
        # print htmlSource

    def test_hasComment(self):
        print "\tTest: has comment"
        htmlSource = self.driver.page_source

        parsed_html = self.parser(htmlSource)
        # print [x for x in dir(parsed_html.body.find('div', attrs={'id': 'shortcut0'})) if '_' not in x]
        hotkey_row = parsed_html.body.find('input', attrs={'id': 'comment1'})
        self.assertNotEquals(None, hotkey_row)
        # print htmlSource

    def test_downloadDisabled(self):
        print "Test: Download disabled"
        htmlSource = self.driver.page_source

        parsed_html = self.parser(htmlSource)
        download_btn = self.driver.find_element_by_id('btnDownload')
        # download_btn = parsed_html.body.find('button', attrs={'id': 'btnDownload'})
        self.assertNotEquals(None, download_btn)

        enabled = download_btn.is_enabled()
        print enabled
        self.assertEqual(False, enabled)

    def test_submitEnabled(self):
        print "Test: Download disabled"
        htmlSource = self.driver.page_source

        parsed_html = self.parser(htmlSource)
        submit_btn = self.driver.find_element_by_id('btnSubmit')
        self.assertNotEquals(None, submit_btn)

        enabled = submit_btn.is_enabled()
        print enabled
        self.assertEqual(True, enabled)
		
if __name__ == '__main__':
    try:
        unittest.main()
    except Exception as e:
        print e
        x = raw_input("Press any key to continue . . .")
        raise