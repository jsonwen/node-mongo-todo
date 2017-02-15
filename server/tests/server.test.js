const expect = require('expect');
const request = require('supertest');
const { ObjectId } = require('mongodb');

const { app } = require('./../server.js');
const { Todo } = require('./../models/todo');
const { User } = require('./../models/user');
const { todos, populateTodos, users, populateUsers } = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .send({ text })
      .expect(200)
      .expect((response) => {
        expect(response.body.text).toBe(text);
      })
      .end((error, response) => {
        if (error) {
          return done(error);
        }

        Todo.find({ text }).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((error) => {
          return done(error);
        });
      });
  });

  it('should not create todo with invalid body data', (done) => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((error, response) => {
        if (error) {
          return done(error);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((error) => {
          return done(error);
        });
      });
  });

  describe('GET /todos', () => {
    it('should get all todos', (done) => {
      request(app )
        .get('/todos')
        .expect(200)
        .expect((response) => {
          expect(response.body.todos.length).toBe(2);
        })
        .end(done);
    });
  });

  describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
      request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .expect(200)
        .expect((response) => {
          expect(response.body.todo.text).toBe(todos[0].text);
        })
        .end(done);
    });

    it('should return a 404 if todo not found', (done) => {
      const hexObjectId = new ObjectId().toHexString();
      request(app)
        .get(`/todos/${hexObjectId}`)
        .expect(404)
        .end(done);
    });

    it('should return 404 for non-object ids', (done) => {
      request(app)
        .get('/todos/123')
        .expect(404)
        .end(done);
    });
  });

  describe('DELETE /todos/:id', () => {
    it('should remove a todo', (done) => {
      var hexObjectId = todos[1]._id.toHexString();
      request(app)
        .delete(`/todos/${hexObjectId}`)
        .expect(200)
        .expect((response) => {
          expect(response.body.todo._id).toBe(hexObjectId);
        })
        .end((error, response) => {
          if (error) {
            return done(error);
          }
          Todo.findById(hexObjectId).then((todo) => {
            expect(todo).toNotExist();
            done();
          }).catch((error) => {
            return done(error);
          });
        });
    });

    it('should return 404 if no todo not found', (done) => {
      var hexObjectId = new ObjectId().toHexString();
      request(app)
        .delete(`/todos/${hexObjectId}`)
        .expect(404)
        .end(done);
    });

    it('should return 404 if object id is invalid', (done) => {
      request(app)
        .delete('/todos/123')
        .expect(404)
        .end(done);
    });
  });

  describe('PATCH /todos/:id', () => {
    it('should update the todo', (done) => {
      var hexObjectId = todos[0]._id.toHexString();
      var data = {
        text: 'Updated text',
        completed: true,
        completedAt: new Date().getTime()
      }
      request(app)
        .patch(`/todos/${hexObjectId}`)
        .send(data)
        .expect(200)
        .expect((response) => {
          expect(response.body.todo.text).toBe(data.text);
          expect(response.body.todo.completed).toBe(true);
          expect(response.body.todo.completedAt).toBeA('number');
        })
        .end(done);
    });

    it('should clear completedAt when todo is not completed', (done) => {
      var hexObjectId = todos[1]._id.toHexString();
      var data = {
        text: 'Updated text 2',
        completed: false,
      };
      request(app)
        .patch(`/todos/${hexObjectId}`)
        .send(data)
        .expect(200)
        .expect((response) => {
          expect(response.body.todo.text).toBe(data.text);
          expect(response.body.todo.completed).toBe(false);
          expect(response.body.todo.completedAt).toNotExist();
        })
        .end(done);
    });
  });

  describe('GET /users/me', () => {
    console.log('users[0].tokens[0].token', users[0].tokens[0].token);
    it('should return user if authenticated', (done) => {
      request(app)
        .get('/users/me')
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect((response) => {
          expect(response.body._id).toBe(users[0]._id.toHexString());
          expect(response.body.email).toBe(users[0].email);
        })
        .end(done);
    });

    it('should return 401 if not authenticated', (done) => {
      request(app)
        .get('/users/me')
        .expect(401)
        .expect((response) => {
          expect(response.body).toEqual({});
        })
        .end(done);
    });
  });

  describe('POST /users', () => {
    it('should create a user', (done) => {
      var email = 'example@example.com';
      var password = '1234aabbcc!';

      request(app)
        .post('/users')
        .send({ email, password })
        .expect(200)
        .expect((response) => {
          expect(response.headers['x-auth']).toExist();
          expect(response.body._id).toExist();
          expect(response.body.email).toBe(email);
        })
        .end((error) => {
          if (error) {
            return done(error);
          }

          User.findOne({ email }).then((user) => {
            expect(user).toExist();
            expect(user.password).toNotBe(password);
            done();
          });
        });
    });

    it('should return validation errors if request is invalid', (done) => {
      var email = 'aaaa';
      var password = 'bbbb';
      request(app)
        .post('/users')
        .send({ email, password })
        .expect(400)
        .end(done);
    });

    it('should not create user if email is in use', (done) => {
      var email = users[0].email;
      var password = 'bbbb';
      request(app)
        .post('/users')
        .send({ email, password })
        .expect(400)
        .end(done);
    });
  })

});