import random


class Graph(object):
    def __init__(self, cost_matrix: list, node_count: int):
        self.matrix = cost_matrix
        self.node_count = node_count
        self.pheromone = [[1 / (node_count * node_count) for j in range(node_count)] for i in range(node_count)]


class AntColony(object):
    def __init__(self, ant_count: int, iterations: int, alpha: float, beta: float, rho: float, q: int):
        self.Q = q
        self.rho = rho
        self.beta = beta
        self.alpha = alpha
        self.ant_count = ant_count
        self.iterations = iterations

    def _update_pheromone(self, graph: Graph, ants: list):

        for i, row in enumerate(graph.pheromone):
            for j, col in enumerate(row):
                graph.pheromone[i][j] *= self.rho
                for ant in ants:
                    graph.pheromone[i][j] += ant.pheromone_delta[i][j]

    def solve(self, graph: Graph):
        
        best_cost = float('inf')
        best_solution = []
        for gen in range(self.iterations):
            ants = [_Ant(self, graph) for i in range(self.ant_count)]
            for ant in ants:
                for i in range(graph.node_count - 1):
                    ant._select_next()
                ant.total_cost += graph.matrix[ant.selected_nodes[-1]][ant.selected_nodes[0]]
                if ant.total_cost < best_cost:
                    best_cost = ant.total_cost
                    best_solution = [] + ant.selected_nodes
                ant._update_pheromone_delta()
            self._update_pheromone(graph, ants)
        return best_solution, best_cost


class _Ant(object):
    def __init__(self, aco: AntColony, graph: Graph):
        self.colony = aco
        self.graph = graph
        self.total_cost = 0.0
        self.selected_nodes = []  
        self.pheromone_delta = [] 
        self.allowed = [i for i in range(graph.node_count)]
        self.eta = [[0 if i == j else 1 / graph.matrix[i][j] for j in range(graph.node_count)] for i in range(graph.node_count)]  # heuristic information
        start = random.randint(0, graph.node_count - 1)  
        self.selected_nodes.append(start)
        self.current = start
        self.allowed.remove(start)

    def _select_next(self):
        totalSum = 0
        for i in self.allowed:
            totalSum += self.graph.pheromone[self.current][i] ** self.colony.alpha * self.eta[self.current][i] ** self.colony.beta
        probabilities = [0 for i in range(self.graph.node_count)] 
        for i in range(self.graph.node_count):
            try:
                self.allowed.index(i)  
                probabilities[i] = self.graph.pheromone[self.current][i] ** self.colony.alpha * \
                    self.eta[self.current][i] ** self.colony.beta / totalSum
            except ValueError:
                pass  
        selected = 0
        rand = random.random()
        for i, probability in enumerate(probabilities):
            rand -= probability
            if rand <= 0:
                selected = i
                break
        self.allowed.remove(selected)
        self.selected_nodes.append(selected)
        self.total_cost += self.graph.matrix[self.current][selected]
        self.current = selected

    def _update_pheromone_delta(self):
        self.pheromone_delta = [[0 for j in range(self.graph.node_count)] for i in range(self.graph.node_count)]
        
        for k in range(1, len(self.selected_nodes)):
            i = self.selected_nodes[k - 1]
            j = self.selected_nodes[k]

            self.pheromone_delta[i][j] = self.colony.Q / self.graph.matrix[i][j]
