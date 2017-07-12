from flask import Flask
from flask import render_template

app = Flask(__name__, static_url_path="/static")

@app.route('/')
def main():
    return render_template('main.html')

# @TODO - make sure accepts a category slug 
@app.route('/category')
def category():
    return render_template('category.html')

# @TODO - make sure accepts a item slug 
@app.route('/item')
def item():
    return render_template('item.html')


if __name__ == '__main__':
    # @TODO - remove debug mode
    app.run(host='0.0.0.0', port=8000, debug=True)

