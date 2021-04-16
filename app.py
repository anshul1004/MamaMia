from flask import Flask, request, json, session, render_template
from bson.objectid import ObjectId
import pymongo

# Create
# Read
# Update
# Delete

app = Flask(__name__)

myclient = pymongo.MongoClient(
    "mongodb+srv://mamamiaadmin:mamamiapassword@italianrestaurant.okus2.mongodb.net/mamamia?retryWrites=true&w=majority")
mydb = myclient["mamamia"]
users = mydb["users"]
menu = mydb["menu"]
orders = mydb["orders"]

@app.route("/")
def index():
    if 'username' in session:
        return 'You are logged in as ' + session['username']
    return render_template('signin.html')

# Read - List all Users
@app.route("/users")
def main():
    response = []
    for record in users.find():
        record['_id'] = str(record['_id'])
        response.append(record)
    return json.dumps(response)


# Read - list and individual User
@app.route('/users/<id>')
def showVideo(id):
    record = users.find_one({'_id': ObjectId(id)})
    record['_id'] = str(record['_id'])
    return json.dumps(record)


# Create - add a new video
# @app.route("/users", methods=['POST'])
# def newUser():
# # new = request.get_json()# new = { "title": title, "description": desc }
# 	# _id = mycol.insert_one(new)
# 	# #return json.dumps({'ObjectId for new movie':str(_id)})
# 	# return json.dumps({'message': 'Video created successfully !'})

# Create - add a new user
@app.route('/users', methods=['POST'])
def newUser():
    new = request.get_json()
    _id = users.insert_one(new)
    return json.dumps({'message': 'User created successfully !'})

# Update - update an existing user
@app.route('/users/<id>', methods=['PUT'])
def updateVideo(id):

    # title = request.args.get('title')
    # desc  = request.args.get('desc')
    new = request.get_json()
    query = {'_id':  ObjectId(id)}
    # newvalues = { "$set": { 'title': title, "description": desc  } }
    newvalues = {"$set": new}
    users.update_one(query, newvalues)

    return json.dumps({'message': 'User updated successfully !'})

# Delete - delete a user
@app.route('/users/<id>', methods=['DELETE'])
def deleteVideo(id):

    query = {'_id':  ObjectId(id)}
    users.delete_one(query)

    return json.dumps({'message': 'User deleted successfully !'})


# Read - List all Menu items
@app.route("/menu")
def getMenu():
    response = []
    for record in menu.find():
        record['_id'] = str(record['_id'])
        response.append(record)
    return json.dumps(response)


# Read - Show individual menu item
@app.route('/menu/<id>')
def getMenuItem(id):
    record = menu.find_one({'_id': ObjectId(id)})
    record['_id'] = str(record['_id'])
    return json.dumps(record)


# Create - add a new menu item
@app.route('/menu', methods=['POST'])
def newMenuItem():
    new_menu_item = request.get_json()
    _id = menu.insert_one(new_menu_item)
    return json.dumps({'message': 'Menu item created successfully !'})


# Update - update an existing menu item
@app.route('/menu/<id>', methods=['PUT'])
def updateMenuItem(id):
    menu_item = request.get_json()
    query = {'_id':  ObjectId(id)}
    updated_menu_item = {"$set": menu_item}
    menu.update_one(query, updated_menu_item)
    return json.dumps({'message': 'Menu item updated successfully !'})


# Delete - delete a menu item
@app.route('/menu/<id>', methods=['DELETE'])
def deleteMenuItem(id):
    query = {'_id':  ObjectId(id)}
    menu.delete_one(query)
    return json.dumps({'message': 'Menu item deleted successfully !'})

# Read - List all orders for a user
@app.route("/orders")
def getOrders():
    userId= session.get('user')
    response = []
    for record in orders.find({'userId': userId}):
        record['_id'] = str(record['_id'])
        response.append(record)
    return json.dumps(response)

# Create - add new order
@app.route('/orders', methods=['POST'])
def newOrderItem():
    new = request.get_json()
    _id = orders.insert_one(new)
    return json.dumps({'message': 'Order item created successfully !'})

# Delete - delete an order
@app.route('/orders/<id>', methods=['DELETE'])
def deleteOrderItem(id):
    query = {'_id':  ObjectId(id)}
    orders.delete_one(query)
    return json.dumps({'message': 'Order item deleted successfully !'})


if __name__ == "__main__":
    app.run()
