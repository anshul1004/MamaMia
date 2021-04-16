
from flask import Flask, request, json, session, render_template
from bson.objectid import ObjectId
import pymongo

# Create
# Read
# Update 
# Delete

app = Flask(__name__)

myclient = pymongo.MongoClient("mongodb+srv://mamamiaadmin:mamamiapassword@italianrestaurant.okus2.mongodb.net/mamamia?retryWrites=true&w=majority")
mydb = myclient["mamamia"]
users = mydb["users"]

@app.route("/")
def index():
	if 'username' in session:
		return 'You are logged in as '+ session['username']
	return render_template('signin.html');

#Read - List all Users
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
	# return json.dumps({'video id': videoid })
	record = users.find_one({'_id' : ObjectId(id)})
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
@app.route('/videos/<id>', methods=['PUT'])
def updateVideo(id):

	# title = request.args.get('title')
	# desc  = request.args.get('desc')
	new = request.get_json()
	query = { '_id':  ObjectId(id) }
	# newvalues = { "$set": { 'title': title, "description": desc  } }
	newvalues = {"$set": new }
	users.update_one(query, newvalues)

	return json.dumps({'message': 'User updated successfully !'})

# Delete - delete a video
@app.route('/videos/<id>', methods=['DELETE'])
def deleteVideo(id):

	query = { '_id':  ObjectId(id) }
	users.delete_one(query)

	return json.dumps({'message': 'User deleted successfully !'})




if __name__ == "__main__":
    app.run()   


