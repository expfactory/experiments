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
import hashlib

here = os.getcwd()

print(here)
index = '%s/index.json' % here
comparator = '%s/metadata.json' % here

if not os.path.exists(comparator):
    os.system('python generate.py %s' %comparator)

def get_content_hash(filename):
    hasher = hashlib.md5()
    with open(filename, 'rb') as filey:
        buffer = filey.read()
        hasher.update(buffer)
    return hasher.hexdigest()

hash1 = get_content_hash(index)
hash2 = get_content_hash(comparator)
os.remove(comparator)

try:
    assert(hash1==hash2)
    print("Metadata has been updated!")
except AssertionError:
    print("-------------------------------------------------------------------")
    print("The index.json must be updated with running generate.py.")
    print("Please update, commit, push, and we will test again.")
    raise

