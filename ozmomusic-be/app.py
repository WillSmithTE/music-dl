from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
import json
import os
from DataService import DataService
from S3Service import S3Service
import logging
import mimetypes
import io

logging.basicConfig()
logging.root.setLevel(logging.DEBUG)

app = Flask(__name__)
CORS(app)
app.config['MAX_CONTENT_LENGTH'] = 500 * 1000 * 1000 # max size 500 MB

dataService = DataService()
s3Service = S3Service()


@app.route("/ping", methods=["GET"])
def ping():
    return jsonify({'message': 'hi'})


@app.route("/api/metadata", methods=["GET"])
def getMetadata():
    url = request.args.get('url')
    logging.info("getMetadata (url=%s)", url)
    return jsonify(dataService.getMetadata(url))


@app.route("/api/media", methods=["GET"])
def getFile():
    url = request.args.get('url')
    logging.info("getFile (url=%s)", url)

    data, metadata = dataService.downloadFile(url)

    extension = metadata.get("ext")
    extractor = metadata.get("extractor")
    songId = metadata.get("id")
    fileName = extractor + "_" + songId + "." + extension

    fileUri = s3Service.uploadAndGetUrl(data, fileName)
    logging.info("data uploaded to s3 (s3Url=%s)", fileUri)

    return jsonify({"uri": fileUri, "fileName": fileName})

@app.route("/api/media", methods=["DELETE"])
def deleteFromS3():
    fileName = request.args.get('fileName')
    logging.info("delete (fileName=%s)", fileName)

    s3Service.deleteUploaded(fileName)
    logging.info("file deleted (fileName=%s)", fileName)

    return jsonify({"result": "success"})

if os.environ.get("LOCAL") == "True":
    logging.debug("In local mode, starting server")
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)), debug=False)
