/*

import Gren.Kernel.Scheduler exposing (binding, fail, rawSpawn, succeed, spawn)
import Basics exposing (never)
import Maybe exposing (Just, Nothing)
import IndexedDb exposing (open, Test, applyUpgrade, Database, Ref)
import IndexedDb.Transaction as Transaction exposing (actionToTask, Transaction, Unknown, Aborted, execute)
import Task exposing (perform)

*/

var _IndexedDb_createIndex = F3(function (name, keyPath, transaction) {
  try {
    console.log(transaction.createIndex(name, keyPath))
  } catch (err) {
    console.log("err", err);
    var err = new Error("error");
    throw err;
  };
});

var _IndexedDb_deleteIndex = function (transaction) {
  try {
  } catch {

  }
};

var _IndexedDb_createObjectStore = F4(function (name, keyPath, autoIncrement, transaction) {
  try {
    var options = {
      autoIncrement: autoIncrement
    };
    if (keyPath != "") {
      options.keyPath = keyPath
    }
    transaction.db.createObjectStore(name, options);
  } catch (err) {
    console.log("err", err);
    throw new Error("");
  };
});

var _IndexedDb_deleteObjectStore = function (transaction) {
  try {
  } catch {

  }
};

var _IndexedDb_abortTransaction = function (transaction) {
  try {
    transaction.abort();
  } catch (err) {
    var err = new Error();
    err.data = { reason: __Transaction_Unknown("Problem with aborting the transaction") };
    throw err;
  }
};

var _IndexedDb_open = F3(function (name, version, upgrade) {
  return __Scheduler_binding(function (callback) {
    new Promise(function (resolve, reject) {
      var request = window.indexedDB.open(name, version);
      request.onerror = function (event) {
        return reject(__Transaction_Unknown("???"));
      };
      request.onupgradeneeded = function (event) {
        var transaction = event.target.transaction;
        transaction.onabort = function (error) {
          return reject(__Transaction_Unknown("Aborted transaction because of action error"));
        };
        try {
          var constructedTransaction = A2(__Transaction_Transaction, transaction, []);
          var upgrades = A3(upgrade, event.oldVersion, event.newVersion, constructedTransaction);
          upgrades.b.forEach(function (action) { A2(__Transaction_actionToTask, action, transaction) });
        } catch (err) {
          return _IndexedDb_abortTransaction(transaction);
        }
        return resolve(event.target.result);
      };
      request.onsuccess = function (event) {
        return resolve(event.target.result);
      };
    })
      .then(function (res) {
        return callback(__Scheduler_succeed(__IndexedDb_Database(res)));
      }).catch(function (err) {
        var error;
        if (err) {
          error = err;
        } else {
          error = __Transaction_Unknown("There was an unknown error when opening the database");
        }
        return callback(__Scheduler_fail(error));
      });
  })
});
