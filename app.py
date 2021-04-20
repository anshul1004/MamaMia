from flask import Flask, request, json, session, render_template, redirect, url_for
from bson.objectid import ObjectId
import pymongo
import bcrypt
# from bcrypt import Bcrypt

# Create
# Read
# Update
# Delete

app = Flask(__name__)
# bcrypt = Bcrypt(app)
salt= bcrypt.gensalt()
app.secret_key='secret key can be anything'

myclient = pymongo.MongoClient(
    "mongodb+srv://mamamiaadmin:mamamiapassword@italianrestaurant.okus2.mongodb.net/mamamia?retryWrites=true&w=majority")
mydb = myclient["mamamia"]
users = mydb["users"]
menu = mydb["menu"]
orders = mydb["orders"]

@app.route("/")
def index():
    # if 'username' in session:
    #     return 'You are logged in as ' + session['username']
    return render_template('signup.html')


# Read - List all Users
@app.route("/users")
def main():
    response = []
    for record in users.find():
        record['_id'] = str(record['_id'])
        record['password']= record['password'].decode()
        response.append(record)
    print(response)
    return json.dumps(response)

# Read - list an individual User
@app.route('/users/<id>')
def showUser(id):
    record = users.find_one({'userId': id})
    record['_id'] = str(record['_id'])
    return json.dumps(record)

# Create - add a new user
@app.route("/users", methods=['POST'])
def addUser():
    newUser = request.get_json()
    # encode, hash, decode before storing in db
    newUser['password']= bcrypt.hashpw(newUser['password'].encode('utf-8'), salt).decode('utf-8')
    users.insert_one(newUser)
    return json.dumps({'message': 'user created successfully !'})

# Create - edit password based on username
@app.route("/users/<username>", methods=['PUT'])
def editUser(username):
    data = request.get_json()
    query = {'username': username}
    # encode, hash, decode before storing in db
    newPass= bcrypt.hashpw(data['password'].encode('utf-8'), salt).decode('utf-8')
    newvalues = {"$set": {'password': newPass}}
    users.update_one(query, newvalues)
    return json.dumps({'message': 'user updated successfully !'+ data['password']})

@app.route("/showSignin")
def showSignin():
    # if 'username' in session:
    #     return 'You are logged in as ' + session['username']
    return render_template('signin.html')

# verify password for entered username
@app.route("/validateSignIn", methods=['POST'])
def verifyUser():
    # user = request.get_json()
    _username = request.form['inputUsername']
    _password = request.form['inputPassword']
    record= users.find_one({'username': _username})
    if record:
        # encode the entered password and db password before checking 
        if bcrypt.checkpw(_password.encode('utf-8'), record['password'].encode('utf-8')):
            #setting session username
            session['username']= _username
            return json.dumps({'message': 'user verified!'})
        else:
            return json.dumps({'message': 'Password incorrect!'})
    else:
        return json.dumps({'message': 'Username doesnt exist'})

# Create - add a new user
@app.route('/signUp', methods=['POST', 'GET'])
def signUp():
    if request.method == 'POST':
        existing_user = users.find_one({'username': request.form['inputUsername']})

        if existing_user is None:
            hashPass = bcrypt.hashpw(request.form['inputPassword'].encode('utf-8'), salt).decode('utf-8')
            users.insert_one({
                'username': request.form['inputUsername'],
                'email': request.form['inputEmail'],
                'password': hashPass
                # 'firstName': request.form['firstName'],
                # 'lastName': request.form['lastName'],
                # 'phone': request.form['phone']
            })
            session['username'] = request.form['inputUsername']
            print('User added succesfully')
        else:
            print('UserName already exists!!')
    # return redirect('/showSignin')
    return render_template('signin.html')

# Delete - delete a user
@app.route('/users/<id>', methods=['DELETE'])
def deleteUser(id):
    query = {'_id': ObjectId(id)}
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
    query = {'_id': ObjectId(id)}
    updated_menu_item = {"$set": menu_item}
    menu.update_one(query, updated_menu_item)
    return json.dumps({'message': 'Menu item updated successfully !'})


# Delete - delete a menu item
@app.route('/menu/<id>', methods=['DELETE'])
def deleteMenuItem(id):
    query = {'_id': ObjectId(id)}
    menu.delete_one(query)
    return json.dumps({'message': 'Menu item deleted successfully !'})

# Read - List all orders for a user
@app.route("/orders")
def getOrders():
    userId= session.get('userId')
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
