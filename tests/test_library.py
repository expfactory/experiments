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


from subprocess import (
    Popen,
    PIPE,
    STDOUT
)
import yaml
 
import os
import re
import sys
from glob import glob
from expfactory.logger import bot
from expfactory.utils import read_json
import json

from expfactory.validator import (
    LibraryValidator,
    ExperimentValidator,
    RuntimeValidator
)
from unittest import TestCase

VERSION = sys.version_info[0]
here = os.getcwd()

print("*** PYTHON VERSION %s BASE TESTING START ***" %(VERSION))

class TestLibrary(TestCase):

    def setUp(self):

        self.LibValidator = LibraryValidator()
        self.ExpValidator = ExperimentValidator()
        self.RuntimeValidator = RuntimeValidator()
        self.experiments_base = "%s/docs/_library" %(here) 
        self.experiments = glob("%s/*" %self.experiments_base)

        process = Popen(['git','diff-tree','--no-commit-id','--name-only','-r','HEAD'], stderr=PIPE, stdout=PIPE)
        added,error = process.communicate()
        added = [x for x in added.decode('utf-8').split('\n') if x]
        self.added = [x for x in added if '_library' in x] 
        
    def test_experiment(self):
        '''test an experiment, including the markdown file, and repo itself
        '''
        print("...Test: Global Library validation")
        for ymlfile in self.experiments:
            self.assertTrue(self.LibValidator.validate(ymlfile))
            url = self.LibValidator.metadata['github']
            self.assertTrue(self.ExpValidator.validate(url))
            result = self.RuntimeValidator.validate(url)
            print(result)
            print(url)        
            self.assertTrue(result)


if __name__ == '__main__':
    unittest.main()
