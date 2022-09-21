/*!
 * backbone.iobind
 * Copyright(c) 2011 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 * https://github.com/logicalparadox/backbone.iobind
 */

(function(a){var b,c,d,e;typeof window=="undefined"||typeof require=="function"?(c=require("jquery"),b=require("underscore"),d=require("backbone"),e=d,typeof module!="undefined"&&(module.exports=e)):(c=this.$,b=this._,d=this.Backbone,e=this);var f=d.sync,g=function(a,e,f){var g=b.extend({},f);g.url?g.url=b.result(g,"url"):g.url=b.result(e,"url")||i();var h=g.url.split("/"),j=h[0]!==""?h[0]:h[1];!g.data&&e&&(g.data=g.attrs||e.toJSON(f)||{}),g.patch===!0&&g.data.id==null&&e&&(g.data.id=e.id);var k=e.socket||d.socket||window.socket,l=c.Deferred();k.send(j+":"+a,g.data,g.url,function(a,b){a?(f.error&&f.error(a),l.reject()):(f.success&&f.success(b),l.resolve())});var m=l.promise();return e.trigger("request",e,m,f),m},h=function(a){return a.ajaxSync?f:g};d.sync=function(a,b,c){return h(b).apply(this,[a,b,c])};var i=function(){throw new Error('A "url" property or function must be specified')}})()