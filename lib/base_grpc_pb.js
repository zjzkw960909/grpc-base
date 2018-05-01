// GENERATED CODE -- DO NOT EDIT!

// Original file comments:
// Copyright 2015 gRPC authors.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
'use strict';
var grpc = require('grpc');
var base_pb = require('./base_pb.js');

function serialize_DataResponse(arg) {
	if (!(arg instanceof base_pb.DataResponse)) {
		throw new Error('Expected argument of type DataResponse');
	}
	return new Buffer(arg.serializeBinary());
}

function deserialize_DataResponse(buffer_arg) {
	return base_pb.DataResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_DataRequest(arg) {
	if (!(arg instanceof base_pb.DataRequest)) {
		throw new Error('Expected argument of type DataRequest');
	}
	return new Buffer(arg.serializeBinary());
}

function deserialize_DataRequest(buffer_arg) {
	return base_pb.DataRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function replaceStr(str){ // 正则法
	var reg = /\b(\w)|\s(\w)/g; //  \b判断边界\s判断空格
	return str.replace(reg,function(m){
		return m.toUpperCase()
	});
}

function getGreeterService(path, methodList) {
	var GreeterService = {};
	methodList.forEach(function(name, i, list){
		GreeterService[name] = {
			path: '/' + path +'/' + replaceStr(name),
			requestStream: false,
			responseStream: false,
			requestType: base_pb.DataRequest,
			responseType: base_pb.DataResponse,
			requestSerialize: serialize_DataRequest,
			requestDeserialize: deserialize_DataRequest,
			responseSerialize: serialize_DataResponse,
			responseDeserialize: deserialize_DataResponse,
		}
	});
	return GreeterService;
}

exports.createGreets = getGreeterService;

