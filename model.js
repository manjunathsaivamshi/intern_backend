import mongoose from 'mongoose'

const Schema=mongoose.Schema

const students=new Schema({
	'rollno':{
		type:Number
	},
	'name':{
		type:String
	},
	
	'dob':{
		type:Date,
	},
	'address':{
		type:String
	}

})

const student=mongoose.model('students',students)

export default student