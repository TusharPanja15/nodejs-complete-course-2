const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');

const User = require('../models/user');
const Post = require('../models/post');
const FeedConroller = require('../controllers/feed');

describe('Feed Controller', function () {
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

    beforeEach(function () { });
    afterEach(function () { });

    it('should add a createdpost to the posts of the creator', function (done) {

        const req = {
            body: {
                title: "Test",
                content: "test"
            },
            file: {
                path: 'abc'
            },
            userId: '62a82d700dd5caba83ef806e'
        };

        const res = {
            status: function () {
                return this;
            },
            json: function () { }
        }

        FeedConroller.createPost(req, res, () => { }).then((savedUser) => {
            expect(savedUser).to.have.property('posts');
            expect(savedUser.posts).to.have.length(1);
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