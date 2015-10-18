var mongoose = require('mongoose');  
var mongoosePaginate = require('mongoose-paginate');

var ReportSchema = new mongoose.Schema({  
	name: 			{ type: String },
	user: 			{ type: String }, 
	date: 			{ type: Date, default: Date.now },
	status: 		{ type: String },
	repository: 	{ type: String },
	output: 		{ type: String }
});

ReportSchema.plugin(mongoosePaginate);
mongoose.model('Report', ReportSchema);