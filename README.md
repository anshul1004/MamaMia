"# MamaMia" 

Signup page:

username
email
password

Signin page:
username or email address
password

Error in get request for users, as password is encrypted using encode('utf-8'), its converting it into bytes and giving the following error 
TypeError: Object of type bytes is not JSON serializable

Tried get request for a particular userId and its working fine
