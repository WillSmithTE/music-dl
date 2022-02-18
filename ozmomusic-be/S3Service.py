import requests
from UrlParser import UrlParser
from util import read, save
from flask import Flask
from flask_cors import CORS
import json
import os
from datetime import datetime
import youtube_dl
from contextlib import redirect_stdout
from io import BytesIO
import logging
import uuid
from contextlib import redirect_stdout
import boto3

BUCKET_NAME = 'willsmithte-songs'
REGION_NAME = 'eu-central-1'

class S3Service:


    def __init__(self):
        self.s3 = boto3.client('s3')

    def uploadAndGetUrl(self, data, fileName):
        print(fileName)
        self.s3.put_object(Body=data, Bucket=BUCKET_NAME, Key=fileName)
        return "http://s3." + REGION_NAME + ".amazonaws.com/" + BUCKET_NAME + "/" + fileName

    def deleteUploaded(self, fileName):
        self.s3.delete_object(Bucket=BUCKET_NAME, Key=fileName)