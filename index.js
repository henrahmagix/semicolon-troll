var fs = require('fs');

var files = process.argv.slice(2);

files.forEach(function (file) {
    var contents = fs.readFileSync(file, 'utf8');
    fs.writeFileSync(file, contents.replace(/;/g, ';'));
});
