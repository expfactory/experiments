'''

test_index.py: Make sure user has updated the index.json

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
import sys
from expfactory.utils import read_json

here = os.getcwd()

print(here)
index = '%s/index.json' % here
comparator = '%s/metadata.json' % here

if not os.path.exists(comparator):
    os.system('python generate.py %s' %comparator)

################################################################################
# Helper functions


def compare_dicts(x,y):
    print("Total items x: %s" %len(x))
    print("Total items y: %s" %len(y))
    try:
        assert(len(y)==len(y))
        print("[pass] lists are equal length")
    except AssertionError:
        print("[fail] invalid, number of items must be equal.")
        raise

    for i in range(len(x)):
        print('\n...%s' %x[i]['name'])
        for key,val in x[i].items():
            if key == "metadata":
                continue
            try:
                assert(y[i][key]==val)
                print("[pass] %s:%s are matching" %(key,val))
            except AssertionError:
                print("[fail] mismatch or missing field for %s" % key)
                print("%s != %s " %(x[i][key],y[i][key]))
                raise                
    
################################################################################
# Tests

x = read_json(index)
y = read_json(comparator)

os.remove(comparator)
compare_dicts(x,y)
