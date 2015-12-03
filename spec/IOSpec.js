var fs = require('fs');
var path = require('path');
var Promise = require('bluebird');

var exec = Promise.promisify(require('child_process').exec);

var run = function (args) {
    return exec(['node', 'index.js'].concat(args).join(' '));
};

describe('semicolon-troll', function () {

    beforeEach(function () {

        this.beforeContents =
            'function foo() {' +
                'var f;' +
                'var x = f;' +
            '}';

        this.afterContents =
            'function foo() {' +
                'var f;' +
                'var x = f;' +
            '}';

        this.noChangeContents = '(function () {}())';

        this.beforePath = 'spec/testfile-before.js';
        this.afterPath = 'spec/testfile-after.js';
        this.noChangePath = 'spec/testfile-no-semicolons.js';

        fs.writeFileSync(this.beforePath, this.beforeContents);
        fs.writeFileSync(this.afterPath, this.afterContents);
        fs.writeFileSync(this.noChangePath, this.noChangeContents);

    });

    afterEach(function () {

        fs.unlinkSync(this.beforePath);
        fs.unlinkSync(this.afterPath);
        fs.unlinkSync(this.noChangePath);

    });

    it('should replace all semicolons in a file with the greek question mark', function (done) {
        run([this.beforePath]).then(function () {
            var beforeActual = fs.readFileSync(this.beforePath, 'utf8');
            expect(beforeActual).not.toBe(this.beforeContents);
            expect(beforeActual).toBe(this.afterContents);
            done();
        }.bind(this));
    });

    it('should leave a file unchanged when it contains no semicolons', function (done) {
        run([this.noChangePath]).then(function () {
            var noChangeActual = fs.readFileSync(this.noChangePath, 'utf8');
            expect(noChangeActual).toBe(this.noChangeContents);
            done();
        }.bind(this));
    });

    it('should allow multiple files', function (done) {
        run([this.noChangePath, this.beforePath]).then(function () {
            var beforeActual = fs.readFileSync(this.beforePath, 'utf8');
            expect(beforeActual).toBe(this.afterContents);
            var noChangeActual = fs.readFileSync(this.noChangePath, 'utf8');
            expect(noChangeActual).toBe(this.noChangeContents);
            done();
        }.bind(this));
    });

});
