import PouchDB from "pouchdb-core";
import pouchDBAdapterIDB from "pouchdb-adapter-idb";
import pouchDBAdapterWebSQL from "pouchdb-adapter-websql";
import pouchDBMapReduce from "pouchdb-mapreduce";
import pouchDBReplication from "pouchdb-replication";

export default PouchDB
	.plugin( pouchDBAdapterIDB )
	.plugin( pouchDBAdapterWebSQL )
	.plugin( pouchDBMapReduce )
	.plugin( pouchDBReplication );