mocha.setup( "bdd" ); // eslint-disable-line no-undef

chai.use( require( "chai-as-promised" ) );
require( "sinon-chai" );
window.expect = chai.expect;
window.should = chai.should();

let context = require.context( "../test", true, /^(.*-spec\.(coffee$))[^.]*$/igm );
context.keys().forEach( context ); // eslint-disable-line lodash/prefer-lodash-method
context = require.context( "../script", true, /^(.*-spec\.(coffee$))[^.]*$/igm );
context.keys().forEach( context ); // eslint-disable-line lodash/prefer-lodash-method