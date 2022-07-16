const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');

const User = require('../models/user');
const AuthConroller = require('../controllers/auth');

describe('Auth Controller', function () {
    before(function (done) {
        mongoose
            .connect('mongodb+srv://raj:EvlYbfEtt2QJ889N@cluster0.qvv5l.mongodb.net/test-messages?retryWrites=true&w=majority')
            .then(result => {
                const user = new User({
                    email: 'test@test.com',
                    password: 'password',
                    name: 'Test',
                    posts: [],
                    _id: '62a82d700dd5caba83ef806e'
                });
                return user.save();
            })
            .then(() => {
                done();
            })
    });

    // beforeEach(funcion() {});
    // afterEach(funcion() {});

    it('should throw an error with code 500 if accessing the database fails', function (done) {
        sinon.stub(User, 'findOne');
        User.findOne.throws();

        const req = {
            body: {
                email: 'test@test.com',
                password: 'tester'
            }
        };

        AuthConroller.login(req, {}, () => { }).then(result => {
            expect(result).to.be.an('error');
            expect(result).to.have.property('statusCode', 500);
            done();
        });

        User.findOne.restore();
    });

    it('should send a response wih a valid user status for an existing user', function (done) {
        const req = { userId: '62a82d700dd5caba83ef806e' }
        const res = {
            statusCode: 500,
            userStatus: null,
            status: function (code) {
                this.statusCode = code;
                return this;
            },
            json: function (data) {
                this.userStatus = data.status;
            }
        };
        AuthConroller.getStatus(req, res, () => { }).then(() => {
            expect(res.statusCode).to.be.equal(200);
            expect(res.userStatus).to.be.equal('I am new!');
            done();
        });
    });

    after(function (done) {
        User.deleteMany({})
            .then(() => {
                return mongoose.disconnect();
            })
            .then(() => {
                done();
            });
    })
});