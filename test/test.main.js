/* global mocha */
function _init(/*options*/) {
  mocha.setup("bdd");

  chai.use(require("chai-as-promised"));
  require("sinon-chai");
  window.expect = chai.expect;
  window.should = chai.should();

  let context = require.context(
    "../test",
    true,
    /^(.*-spec\.(coffee$))[^.]*$/gim,
  );
  context.keys().forEach(context);
  context = require.context(
    "../script",
    true,
    /^(.*-spec\.(coffee$))[^.]*$/gim,
  );
  context.keys().forEach(context);
}

if (window.__karma__) {
  _init({
    callback: window.__karma__.start,
  });
}
