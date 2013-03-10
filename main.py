#!/usr/bin/env python
#
# Copyright 2007 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

import logging
import webapp2
import os
import datetime
import json

from google.appengine.ext.webapp import template
from google.appengine.api import urlfetch


class MainHandler(webapp2.RequestHandler):
    def get(self):
        tmpl_path = os.path.join(os.path.dirname(__file__), './tmpl/color.html')
        self.response.out.write(template.render(tmpl_path, {}))

class ColorAvgHandler(webapp2.RequestHandler):
    def get(self):
        ids_str = self.request.get('ids')
        ids = ids_str.split(',')
        
        results = []
        for id in ids:
            results.append({'id': id, 'rgb': '004400'})
            
        self.response.out.write(json.dumps({'results': results}))
        
class ImageProxy(webapp2.RequestHandler):
    def get(self):
        url = self.request.get('img_url')
        
        logging.info('fetching url: %s' % url);
        result = urlfetch.fetch(url)
        
        if result.status_code == 200:      
            thirty_days_in_seconds = 4320000
            expires_date = datetime.datetime.now() + datetime.timedelta(days=30)
            HTTP_HEADER_FORMAT = "%a, %d %b %Y %H:%M:00 GMT"        
            self.response.headers["Expires"] = expires_date.strftime(HTTP_HEADER_FORMAT)
            self.response.headers["Cache-Control"] = "public, max-age=%s" % thirty_days_in_seconds
            self.response.headers['Content-Type'] = 'image/png'
            self.response.out.write(result.content)
            
        else:
            self.response.set_status(500)
            self.response.out.write(json.dumps({'error': 'fail'}))

app = webapp2.WSGIApplication([
    ('/', MainHandler),
    ('/avg/?', ColorAvgHandler),
    ('/get/img/?', ImageProxy)
], debug=True)
