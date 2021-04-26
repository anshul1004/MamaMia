import os
from flask import Flask, request, json, session, render_template, redirect, url_for, flash
from bson.objectid import ObjectId
import pymongo
import bcrypt
import re
from werkzeug.utils import secure_filename

UPLOAD_FOLDER = 'static/mamamiaImages/'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
# bcrypt = Bcrypt(app)
salt = bcrypt.gensalt()
app.secret_key = 'secret key can be anything'

myclient = pymongo.MongoClient(
    "mongodb+srv://mamamiaadmin:mamamiapassword@italianrestaurant.okus2.mongodb.net/mamamia?retryWrites=true&w=majority")
mydb = myclient["mamamia"]
users = mydb["users"]
menu = mydb["menu"]
orders = mydb["orders"]
cart = mydb["cart"]


@app.route("/")
def index():
    if 'email' in session:
        return render_template('userdashboard.html')
    return render_template('index.html')

@app.route("/aboutUs")
def showAboutUs():
    return render_template('about.html')

@app.route("/contactUs")
def showContactUs():
    return render_template('contact-us.html')

@app.route('/logout')
def logout():
    session.pop('email',None)
    if 'isAdmin' in session:
        session.pop('isAdmin', None)
    return redirect('/')

@app.route("/showSignUp")
def showSignUp():
    return render_template('signup.html')


@app.route("/showSignIn")
def showSignIn():
    if 'email' in session:
        render_template('userdashboard.html')
    return render_template('signin.html')


@app.route("/dashboard")
def userHome():
    if 'email' in session:
        if 'isAdmin' in session:
            return render_template('admindashboard.html')
        else:
            return render_template('userdashboard.html')
    return render_template('index.html')

# SignUp feature
# If already user exists in backend show message
# else register the user


@app.route('/signUp', methods=['POST', 'GET'])
def signUp():
    if request.method == 'POST':
        email = request.form['inputEmail']
        password = request.form['inputPassword']
        regex_email = '^(\w|\.|\_|\-)+[@](\w|\_|\-|\.)+[.]\w{2,3}$'
        regex_passwd = "^.*(?=.{8,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$"
        if re.search(regex_email, email) and re.findall(regex_passwd, password):
            existing_user = users.find_one({'email': email})
            if existing_user is None:
                hashPass = bcrypt.hashpw(
                    request.form['inputPassword'].encode('utf-8'), salt).decode('utf-8')
                users.insert_one({
                    'email': email,
                    'password': hashPass,
                    'isAdmin': False
                })
                session['email'] = email
                return json.dumps({"message": "User Created Suucesfully"})
            else:
                # flash('UserName already exists!!')
                return json.dumps({"message": "User already exists"})
        else:
            return json.dumps({"error": "Invalid Credentials"})


# SignIn feature
# Verify if the User credentials are correct
# If correct go to userdashboard otherwise show alert messages with validation messages.
@app.route("/signIn", methods=['POST'])
def verifyUser():
    # user = request.get_json()
    email = request.form['inputUsername']
    password = request.form['inputPassword']

    record = users.find_one({'email': email})
    if record:
        # encode the entered password and db password before checking
        if bcrypt.checkpw(password.encode('utf-8'), record['password'].encode('utf-8')):
            # setting session username
            session['email'] = email

            # Check if the user is an admin
            if record['isAdmin'] == True:
                session['isAdmin'] = True
            return json.dumps({'message': 'user verified!'})
        else:
            return json.dumps({'message': 'Password incorrect!'})
    else:
        return json.dumps({'message': 'Username doesnt exist'})


@app.route("/showCart")
def showCart():
    if 'email' in session:
        return render_template('cart.html')
    return render_template('signin.html')

@app.route("/checkout")
def checkout():
    if 'email' in session:
        return render_template('checkout.html')
    return render_template('signin.html')


@app.route("/getCart")
def getCart():
    email = session.get('email')
    response = cart.find_one({'email': email})
    response['_id'] = str(response['_id'])
    # for record in cart.find({'email': email}):
    #     record['_id'] = str(record['_id'])
    #     response.append(record)
    return json.dumps(response)


@app.route("/updateCart", methods=['PUT'])
def updateCart():
    print("###########################################################################")
    print(request.get_json())
    data = request.get_json()
    email = data['email']
    query = {'email': email}
    items = data['items']
    newvalues = {"$set": {'items': items}}
    cart.update_one(query, newvalues)
    return json.dumps({'message': 'Cart updated successfully !'})


# Read - List all Users
# @app.route("/users")
# def main():
#     response = []
#     for record in users.find():
#         record['_id'] = str(record['_id'])
#         record['password'] = record['password'].decode()
#         response.append(record)
#     print(response)
#     return json.dumps(response)

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
    newUser['password'] = bcrypt.hashpw(
        newUser['password'].encode('utf-8'), salt).decode('utf-8')
    users.insert_one(newUser)
    return json.dumps({'message': 'user created successfully !'})

# Create - edit password based on username


@app.route("/users/<username>", methods=['PUT'])
def editUser(username):
    data = request.get_json()
    query = {'username': username}
    # encode, hash, decode before storing in db
    newPass = bcrypt.hashpw(data['password'].encode(
        'utf-8'), salt).decode('utf-8')
    newvalues = {"$set": {'password': newPass}}
    users.update_one(query, newvalues)
    return json.dumps({'message': 'user updated successfully !' + data['password']})


# @app.route("/showSignin")
# def showSignin():
#     # if 'username' in session:
#     #     return 'You are logged in as ' + session['username']
#     return render_template('signin.html')

# verify password for entered username


# @app.route("/signin", methods=['POST'])
# def verifyUser():
#     # user = request.get_json()
#     _username = request.form['username']
#     _password = request.form['password']
#     record = users.find_one({'username': _username})
#     if record:
#         # encode the entered password and db password before checking
#         if bcrypt.checkpw(_password.encode('utf-8'), record['password'].encode('utf-8')):
#             # setting session username
#             session['username'] = _username
#             session['status'] = 'loggedIn'
#             return json.dumps({'message': 'user verified!'})
#         else:
#             return json.dumps({'message': 'Password incorrect!'})
#     else:
#         return json.dumps({'message': 'Username doesnt exist'})

# Create - add a new user


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
    query = { "isAvailable": True }
    for record in menu.find(query):
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
    new_menu_item_dict = { "name": request.form['name'], "category": request.form['category'], "description": request.form['description'], "price": request.form['price'], "image": "tempFileName.jpg", "isAvailable": True}

    new_menu_item = menu.insert_one(new_menu_item_dict)

    # check if the post request has the file part
    if request.files:
        file = request.files['image']
        if file and file.filename != '' and allowedFile(file.filename):
            filename = secure_filename(file.filename)
            filename_string = str(filename)
            curr_id = new_menu_item.inserted_id
            filename = str(curr_id) + "." + filename_string.split('.')[1]

            query = { "_id": curr_id }
            updated_image_name = { "$set": { "image": filename } }
            menu.update_one(query, updated_image_name)

            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

    return json.dumps({'message': 'Menu item created successfully !'})


# Update - update an existing menu item
@app.route('/menu/<id>', methods=['PUT'])
def updateMenuItem(id):
    menu_item = {}
    if 'name' in request.form:
        menu_item['name'] = request.form['name']
    if 'category' in request.form:
        menu_item['category'] = request.form['category']
    if 'description' in request.form:
        menu_item['description'] = request.form['description']
    if 'price' in request.form:
        menu_item['price'] = request.form['price']
    if request.files and 'image' in request.files:
        file = request.files['image']
        if file and file.filename != '' and allowedFile(file.filename):
            filename = secure_filename(file.filename)
            filename_string = str(filename)
            curr_id = request.form['_id']
            filename = str(curr_id) + "." + filename_string.split('.')[1]
            menu_item['image'] = filename
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    if 'isAvailable' in request.form:
        if request.form['isAvailable'] == "false":
            menu_item['isAvailable'] = False
        else:
            menu_item['isAvailable'] = True
    
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


def allowedFile(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


# Read - List all orders for a user


@app.route("/orders")
def getOrders():
    userId = session.get('userId')
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
