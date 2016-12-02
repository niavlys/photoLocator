#!/usr/bin/eval PYTHONPATH=/home/niavlys/modules python
import site
site.addsitedir("/home/niavlys/modules")
from flask import Flask,render_template
app = Flask(__name__)

@app.route('/')
def photolocate():
    return render_template('photoLocate.html')

@app.route('/compute', methods=['GET'])
def compute():
    print "test here!!"
    data = request.args.get('data')
    return "TBD"

if __name__ == '__main__':
    app.run()
