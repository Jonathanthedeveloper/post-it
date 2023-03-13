# POST IT

Post It is a social media API that allows users to create posts, share content, and reply to posts.

## Live URL

You can access the live API [here](https://post-it-164k.onrender.com)

Documentation Endpoint
You can find the API documentation [here](https://post-it-164k.onrender.com/api/v1/docs)

Database Design Image
Here's a visual representation of the database design:

## Database Design

FInd the database design [here](https://dbdesigner.page.link/KGgfTUSzUwULXwg79)

## Database Approach

### User Schema

The userSchema defines the properties of a user object, including `name`, `email`, `password`, `handle`, `profilePicture`, `bio`, `posts`, `isDeleted`, `deletedAt`, `resetPasswordExpires`, and `resetPassword`.

- name, email, password, handle, profilePicture, isDeleted, and resetPassword are of type `String`
- posts is of type `[Schema.Types.ObjectId]` and references the `Post` model.
- `email` and `handle` are required fields and must be unique.
- `bio` has a maximum length of 250 characters.
  `posts` is initialized with an empty array as a default value.
- `isDeleted` is a boolean flag indicating whether the user has been deleted or not.
- `deletedAt` and `resetPasswordExpires` are timestamps indicating when the user was deleted or when their password reset request will expire.

### Post Schema

The postSchema defines the properties of a post object, including `content`, `user`, `replies`, `likes`, `isDeleted`, and `deletedAt`.

- `content` is of type `String`.
- `user` is a reference to a `User` object.
- `replies` is an array of references to Reply objects.
- `likes` is an array of references to `User` objects who have liked the post.
- `isDeleted` is a `boolean` flag indicating whether the post has been deleted or not.
- `deletedAt` is a `timestamp` indicating when the post was deleted.

### Reply Schema

The replySchema defines the properties of a reply object, including `content`, `user`, `likes`, `isDeleted`, and `deletedAt`.

- `content` is of type `String`.
- `user` is a reference to a `User` object.
- `likes` is an array of references to `User` objects who have liked the reply.
- `isDeleted` is a `boolean` flag indicating whether the reply has been deleted or not.
- `deletedAt` is a `timestamp` indicating when the reply was deleted.

## Why This Approach

### Efficient querying:

The schema design is optimized for efficient querying. By using references to other models, rather than embedding all the data into a single document, it is easier to query for specific pieces of information. For example, to get all the replies to a particular post,the reply field on the postSchema can be used to filter the replies

### Reduced duplication:

By using references to other models, the schema reduces duplication of data. For example, instead of storing all the user information in every post document, the user field on the postSchema only stores the ID of the user who created the post. This reduces the amount of data stored in the database and helps to keep the data consistent.

### Flexibility:

The schema design allows for flexibility in data storage. For example, the posts field on the userSchema is an array of Post object IDs, which allows a user to have many posts. This design can easily scale as the number of posts per user increases, without running into limitations on document size.

### Easy maintenance:

The schema design makes it easy to maintain data consistency. By defining the relationships between models, Mongoose can automatically populate fields with data from related collections, which helps to ensure that the data is up-to-date and consistent.

### What I did with the soft deleted resources

when resources are deleted it is not actually deleted from the database, it is just marked as deleted. This is done to prevent the database from being cluttered with deleted resources. The resources are marked as deleted and are not returned in the response when a user tries to access them, except they have direct links to that resource.

#### Note that only the posts resource can be accessed for now after they have been deleted and the user has a direct link to that resource.(i could have extended this to other resources but i ran out of time), do not mistake that for the fact that the other resources cannot be soft deleted.

# ALL RESOURCES ARE SOFT DELETED

Also these deleted resouces would only be availble for a certain period of time, after which they would be permanently deleted from the database.
this could be achieved using a cron job to periodically purge the database of deleted resources.(note that this was not implented in this project)

## Run Locally

### Clone the project

```bash
  git clone https://github.com/Jonathanthedeveloper/post-it.git
```

### Go to the project directory

```bash
  cd post-it
```

### Install dependencies

```bash
  npm install
```

### Add Environment Variables

add the following Variables to your .env file

`ONLINE_URI`
`JWT_SECRET_TOKEN`
`JWT_EXPIRES_IN`
`EMAIL_ADDRESS`
`EMAIL_PASSWORD`

### Start the server

```bash
  npm start
```

or

```bash
npm run dev
```

The project would be hosted at `127.0.0.1:3000`

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`API_KEY`

`ANOTHER_API_KEY`

## Installation

Install my-project with npm

```bash
  npm install my-project
  cd my-project
```
