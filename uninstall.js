// Copied wholesale from https://github.com/observing/pre-commit/tree/3f83f7298928186335a34424c02088d1c6e358b5/uninstall.js
'use strict';

var fs = require('fs')
  , path = require('path')
  , exists = fs.existsSync || path.existsSync
  , precommit = path.resolve(__dirname, '../..', '.git', 'hooks', 'pre-commit');

//
// Bail out if we don't have pre-commit file, it might be removed manually.
//
if (!exists(precommit)) return;

//
// If we don't have an old file, we should just remove the pre-commit hook. But
// if we do have an old precommit file we want to restore that.
//
fs.unlinkSync(precommit);
if (exists(precommit +'.old')) {
    fs.writeFileSync(precommit, fs.readFileSync(precommit +'.old'));
    fs.chmodSync(precommit, '755');
    fs.unlinkSync(precommit +'.old');
}
