from flask import Flask

app = Flask('blocks')


import blocks.pages
import blocks.xhr
