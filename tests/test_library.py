'''

test.py: Python testing to ensure correct formatting and varibles included for
         metadata in experiments.

Copyright (c) 2017, Vanessa Sochat
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

'''


from subprocess import (
    Popen,
    PIPE,
    STDOUT
)

import requests
 
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
        self.experiments = self.get_changed_files()
        self.added = [x for x in self.experiments if '_library' in x] 
        print('Found %s changed or modified files.' %len(self.added))

    def get_changed_files(self):
        '''use the Github compare url (provided by circle) to find 
        changed files between commits'''

        # Fallback, return all files in experiment base
        experiments = glob("%s/*" %self.experiments_base)

        compare_url = os.environ.get("CIRCLE_COMPARE_URL")
        if compare_url is not None:
            print('Detected running in Circle CI')
            compare_url = "%s.patch" % compare_url
            print("Compare URL: %s" %compare_url)
            response = requests.get(compare_url) 
            if response.status_code == 200:
                experiments = set(re.findall(' docs/_library/.+[.]md',response.text))
                experiments = [x.strip() for x in experiments]        
        else:
            print("Not running in Circle Ci")

        return experiments

    def test_experiment(self):
        '''test an experiment, including the markdown file, and repo itself
        '''
        print("...Test: Global Library validation")
        for ymlfile in self.experiments:
            if os.path.exists(ymlfile):
                print("TESTING %s" %ymlfile)
                self.assertTrue(self.LibValidator.validate(ymlfile))
                url = self.LibValidator.metadata['github']
                self.assertTrue(self.ExpValidator.validate(url))
                result = self.RuntimeValidator.validate(url)
                print(result)
                print(url)        
                self.assertTrue(result)


if __name__ == '__main__':
    unittest.main()
