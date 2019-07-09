from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import math

from ant_colony import AntColony, Graph

app = Flask(__name__)

CORS(app)

@app.route('/',methods=['POST'])
def main():
	json_data = json.loads(str(request.data, encoding='utf-8'))
	adjList = json_data["adj"]
	ant_count = int(json_data["ant_count"])
	iterations = int(json_data["iterations"])
	alpha = float(json_data["alpha"])
	beta = float(json_data["beta"])
	rho = float(json_data["rho"])
	Q = int(json_data["Q"])

	for i in range(len(adjList[0])):
		for j in range(len(adjList[0])):
			if adjList[i][j] is None:
				adjList[i][j]=math.inf

	# print(adjList)
	ac = AntColony(ant_count, iterations, alpha, beta, rho, Q)
	graph = Graph(adjList, len(adjList[0]))
	path, cost = ac.solve(graph)
	data = {
		"cost" : cost,
		"path" : path
	}
	# print(type(data),type(json.dumps(data)))

	return json.dumps(data)