from flask import Flask, jsonify, request
import data
import json 

app = Flask(__name__)


@app.route("/getPlaylists/<token>")
def playlists(token):
   return jsonify(data.getPlaylists(token))

@app.route("/members")
def index():
    return {"members":["1","2","3"]}
    
@app.route("/recommendations/<playlist>",methods=["POST"])
def recommendations(playlist):
    print(request, flush=True)
    body = request.json
    playlists = body['playlists']
    recommendations = data.recommend('genres_v2.csv',playlist,playlists)
    return {"recommendations":json.dumps(recommendations)}

if __name__=="__main__":
    app.run(host="localhost", port=5000, debug=True)