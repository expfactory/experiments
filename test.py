'''

test.py: Python testing to ensure correct formatting and varibles included for
         metadata in experiments.

The MIT License (MIT)

Copyright (c) 2016-2017 Vanessa Sochat, Stanford University

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

'''

import os
import re
import sys
from glob import glob
from expfactory.utils import read_json
import json

from expfactory.validator import (
    LibraryValidator,
    ExperimentValidator
)
from unittest import TestCase

VERSION = sys.version_info[0]
here = os.getcwd()

print("*** PYTHON VERSION %s BASE TESTING START ***" %(VERSION))

class TestLibrary(TestCase):

    def setUp(self):

        self.cli = LibraryValidator()
        self.experiments_base = "%s/experiments" %(here) 
        self.experiments = glob("%s/*" %self.experiments_base)
        

    def test_validate_library(self):
        '''test_validate_library calls all subfunctions
        '''
        print("...Test: Global Library validation")
        for jsonfile in self.experiments:
            self.assertTrue(self.cli.validate(jsonfile))


class TestExperiments(TestCase):

    def setUp(self):

        # Test repo information
        self.cli = ExperimentValidator()
        self.experiments_base = "%s/experiments" %(here) 
        self.experiments = glob("%s/*" %self.experiments_base)
        
    def test_experiments(self):
        '''test_load_json ensures that all files load
        '''
        for jsonfile in self.experiments:
            print("...%s" %os.path.basename(jsonfile))
            config = read_json(jsonfile)
            self.assertTrue('github' in config)
            self.assertTrue(isinstance(config,dict))
            url = config['github']
            self.assertTrue(self.cli.validate(url))


if __name__ == '__main__':
    unittest.main()
