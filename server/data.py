import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
import sys
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from spotipy.oauth2 import SpotifyOAuth
import spotipy.util as util
from sklearn.metrics.pairwise import cosine_similarity

def oneHotEncode(dataframe, column, newColumn):
    ohe = pd.get_dummies(dataframe[column])
    feature_names = ohe.columns
    ohe.columns = [newColumn + "|" + str(i) for i in feature_names]
    ohe.reset_index(drop = True, inplace = True)
    return ohe

def createRelevantData(dataframe,floatColumns):
    genre_ohe = oneHotEncode(dataframe,"genre","genre")
    floats = dataframe[floatColumns].reset_index(drop = True)
    scaler = MinMaxScaler()
    scaled = pd.DataFrame(scaler.fit_transform(floats), columns = floats.columns) * 0.2
    final = pd.concat([genre_ohe, scaled], axis = 1)
    final['song_name']=dataframe['song_name'].values
    return final

def getSongs(currPlaylist,playlists, dataframe):
    playlist = pd.DataFrame()
    currPlaylist = currPlaylist
    sp = spotipy.Spotify(auth=token)
    for index, value in enumerate(sp.playlist(playlists[currPlaylist])['tracks']['items']):
        playlist.loc[index, 'artist'] = value['track']['artists'][0]['name']
        playlist.loc[index, 'name'] = value['track']['name']
        playlist.loc[index, 'id'] = value['track']['id'] 
        playlist.loc[index, 'date_added'] = value['added_at']
    playlist['date_added'] = pd.to_datetime(playlist['date_added'])
    playlist = playlist[playlist['name'].isin(dataframe['song_name'].values)].sort_values('date_added',ascending = False)
    return playlist

def getAverage(relevantData, songs):
    averageSongs = relevantData[relevantData['song_name'].isin(songs['name'].values)].drop('song_name',axis=1).mean(axis=0)
    notInPlaylist = relevantData[~relevantData['song_name'].isin(songs['name'].values)]
    return averageSongs, notInPlaylist

def getRecommendations(df, mean, notInPlaylist):
    recommendations = df[df['song_name'].isin(notInPlaylist['song_name'].values)]
    recommendations['sim'] = cosine_similarity(notInPlaylist.drop('song_name', axis=1).values, mean.values.reshape(1, -1))[:,0]
    return recommendations.sort_values('sim',ascending=False).head(40)

def verify(clientId, secretId, scope):
    auth_manager = SpotifyClientCredentials(client_id=clientId, client_secret=secretId)
    sp = spotipy.Spotify(auth_manager=auth_manager)
    token = util.prompt_for_user_token(scope, client_id=clientId, client_secret=secretId, redirect_uri='http://localhost/')
    return token

def getPlaylists(token):
    sp = spotipy.Spotify(auth=token)
    playlists = {}
    for i in sp.current_user_playlists()['items']:
        playlists[i['name']] = i['uri'].split(':')[2]
    return playlists


def preprocess(csv):
    dataframe = pd.read_csv(csv, low_memory=False)
    dataframe = dataframe.drop_duplicates(subset=['song_name'])
    dataframeNonnull = dataframe[~dataframe.song_name.isnull()].drop(["Unnamed: 0", "mode", "time_signature","duration_ms"], axis=1)
    floatColumns = dataframeNonnull.dtypes[(dataframeNonnull.dtypes == 'float64')|(dataframeNonnull.dtypes == 'int64')].index.values
    dataframeRel = createRelevantData(dataframeNonnull, floatColumns=floatColumns)
    return dataframeRel,dataframeNonnull

def recommend(csv,playlist,playlists):
    dataframeRel,dataframeNonnull= preprocess(csv)
    print(dataframeNonnull.columns.values)
    playlistDefault = getSongs(playlist,playlists,dataframeRel)
    mean, notInPlaylist = getAverage(dataframeRel,playlistDefault)
    recommendations = getRecommendations(dataframeRel,mean,notInPlaylist)
    recommendations = dataframeNonnull[dataframeNonnull['song_name'].isin(recommendations['song_name'].values)]
    print(playlistDefault)
    return dict(zip(recommendations.id,recommendations.song_name))

clientId = 'b9f7c6b1f11049198b9a6916c53bf2f2'
secretId = 'eaca909113c64868944ad36fef239eeb'
scope = 'user-library-read'
username = 'rohpium'
token = verify(clientId,secretId,scope)
playlists = getPlaylists(token)
recommendations = recommend('genres_v2.csv', 'popplaylisttest',playlists)

print(recommendations)