var imported = document.createElement('script');
imported.src = 'vis.js';
document.head.appendChild(imported);



class Graph {

    constructor() {
            this.nodes = [];
            this.adjacencyList = {};
            this.g = null , this.p = null , this.npow=0 ,this.dis = [], this.n=0 , this.outputArray =[] ;
    }

    addNode(node) {
            this.nodes.push(node); 
            this.adjacencyList[node] = [];
    }
    addEdge(node1, node2, weight) {
            this.adjacencyList[node1].push({node:node2, weight: weight});
            // this.adjacencyList[node2].push({node:node1, weight: weight});
    }

    tsp( start, set) {
        var masked, mask, result = -1, temp;
        if (this.g[start][set] != -1) {
            return this.g[start][set];
        } else {
            for (var x = 0; x < this.n; x++) {
                mask = this.npow - 1 - Math.pow(2, x);
                masked = set & mask;
                if (masked != set) {
                    temp = this.dis[start][x] + this.tsp(x, masked);
                    if (result == -1 || result > temp) {
                        result = temp;
                        this.p[start][set] = x;
                    }
                }
            }
            this.g[start][set] = result;
            return result;
        }
    }

    
    getPath(start, set) {
        if (this.p[start][set] == -1) {
            return;
        }
        var x = this.p[start][set];
        var mask = this.npow - 1 - Math.pow(2, x);
        var masked = set & mask;
        this.outputArray.push(x);
        this.getPath(x, masked);
    }

    
    findPathTSP(){

        var best = [];
        this.outputArray = [];

        this.n = this.nodes.length;
        // if(this.n > 20){
        //     alert("Too many point to calculate for Dynamic Programing algorithm");
        //     return;
        // }
        this.dis = new Array(this.n);
        for(var i=0;i<this.n;i++){
            this.dis[i] = new Array(this.n);
            for (j = 0; j < this.n; j++) {
                this.dis[i][j] = Infinity;
            }     
        }
        Object.keys(this.adjacencyList).forEach(i =>{
            this.adjacencyList[i].forEach(node =>{

                // alert();
                this.dis[i][node.node]=node.weight;

            });
        });

        return this.dis;

        var i, j;
    
        var inputArray = this.dis;
        this.npow = Math.pow(2,this.n);
        this.g = new Array(this.n);
        this.p = new Array(this.n);
        for(i=0;i<this.n;i++){
            this.g[i] = new Array(this.npow);
            this.p[i] = new Array(this.npow);
            for (j = 0; j < this.npow; j++) {
                this.g[i][j] = -1;
                this.p[i][j] = -1;
            }
        }
        for (i = 0; i < this.n; i++) {
            this.g[i][0] = inputArray[i][0];
        }
        
        var result = this.tsp( 0, this.npow - 2);
        this.outputArray.push(0);
        this.getPath( 0 , this.npow - 2);
        this.outputArray.push(result);

        
        for(i=0;i<this.n;i++){
            best.push(this.outputArray[i]);
        }

        // alert(JSON.stringify(best));
        var cost = 0;

        for(var i = 0; i < best.length - 1; i++){
            cost +=this.dis[best[i]][best[i+1]];
            // alert(this.dis[best[i]][best[i+1]])
        }
             

        return {
            path : this.outputArray,
            cost : cost
        };
    }

}


class PriorityQueue {
    constructor() {
        this.collection = [];
    }
    enqueue(element){
    if (this.isEmpty()){ 
      this.collection.push(element);
    } else {
      let added = false;
      for (let i = 1; i <= this.collection.length; i++){
        if (element[1] < this.collection[i-1][1]){ 
          this.collection.splice(i-1, 0, element);
          added = true;
          break;
        }
      }
      if (!added){
          this.collection.push(element);
      }
    }
  };

  dequeue() {
    let value = this.collection.shift();
    return value;
  };

  isEmpty() {
    return (this.collection.length === 0) 
  };
}


var nodes, edges, network;
        
function addNode() {
    try {
        nodes.add({
            id: document.getElementById('node-id').value,
            // label: document.getElementById('node-label').value
            label: 'Node '+document.getElementById('node-id').value
        });
    }
    catch (err) {
        alert(err);
    }

}
function updateNode() {
    try {
        nodes.update({
            id: document.getElementById('node-id').value,
            // label: document.getElementById('node-label').value
            label: 'Label '+document.getElementById('cost').value

        });
    }
    catch (err) {
        alert(err);
    }
}
function removeNode() {
    try {
        nodes.remove({id: document.getElementById('node-id').value});
    }
    catch (err) {
        alert(err);
    }
}

function addEdge() {
    try {
        edges.add({
            arrows: 'to',
            id: document.getElementById('edge-id').value,
            from: document.getElementById('edge-from').value,
            to: document.getElementById('edge-to').value,
            label : document.getElementById('cost').value, //label = cost
            cost : document.getElementById('cost').value
        });
        
    }
    catch (err) {
        alert(err);
    } 
    
    // console.log(edges._data[1]['to']);

    // var aaa = (JSON.parse(JSON.stringify(edges))['_data']);

    // console.log(aaa);
}
function updateEdge() {
    try {
        edges.update({
            id: document.getElementById('edge-id').value,
            from: document.getElementById('edge-from').value,
            to: document.getElementById('edge-to').value
        });
    }
    catch (err) {
        alert(err);
    }
}
function removeEdge() {
    try {
        edges.remove({id: document.getElementById('edge-id').value});
    }
    catch (err) {
        alert(err);
    }
}

function draw() {
    
    nodes = new vis.DataSet();
    edges = new vis.DataSet();

    // inaro gozashtam ke hey node edges ezafe nakonim bara neshon dadan
    nodes.add([ 
        {id: '0', label: 'Node 0'},
        {id: '1', label: 'Node 1'},
        {id: '2', label: 'Node 2'},
        {id: '3', label: 'Node 3'},
        {id: '4', label: 'Node 4'}
    ]);

    edges.add([
        {id: '0', from: '0', to: '1', label: '1', arrows:'to', cost: '1'},
        {id: '1', from: '1', to: '2', label: '1', arrows:'to', cost: '1'},
        {id: '2', from: '2', to: '3', label: '2', arrows:'to', cost: '2'},
        {id: '3', from: '3', to: '4', label: '3', arrows:'to', cost: '3'},
        {id: '4', from: '4', to: '0', label: '3', arrows:'to', cost: '3'},
        {id: '5', from: '0', to: '2', label: '2', arrows:'to', cost: '2'}
    ]);
    var container = document.getElementById('network');
    var data = {
        nodes: nodes,
        edges: edges
    };
    var options = {};
    network = new vis.Network(container, data, options);

    // alert(JSON.stringify(((edges._data)[1]).id));
    // alert(edges._data);
}

function Resullt() {

    var g = new Graph();
    for (var node in nodes._data) {
        g.addNode(node);
    }

    for ( var edge in edges._data ){
        // alert((edges._data[edge]).from);
        g.addEdge( (edges._data[edge]).from , (edges._data[edge]).to , parseInt((edges._data[edge]).cost, 10));
    }

    var path , cost ;
    result = g.findPathTSP();


    var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance 
    var theUrl = "http://127.0.0.1:5000/";
    xmlhttp.addEventListener("loadend", transferComplete);
    xmlhttp.open("POST", theUrl);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    // xmlhttp.send(JSON.stringify({ "adj": JSON.stringify(result)}));
    xmlhttp.send(JSON.stringify({ "adj": result,
                                  "ant_count": document.getElementById('ant_count').value ,
                                  "iterations": document.getElementById('iterations').value ,
                                  "alpha": document.getElementById('alpha').value ,
                                  "beta": document.getElementById('beta').value ,
                                  "rho": document.getElementById('rho').value ,
                                  "Q": document.getElementById('Q').value 
                                  }));
    
}

function transferComplete(evt) {
    // var res =xmlhttp.responseText;
    
    // console.log("'"+xmlhttp.responseText+"'");
        // var o = JSON.parse(res);
        // console.log(typeof(res))XMLHttpRequest
    // console.log(evtart.XMLHttpRequest);

    // console.log(JSON.parse(res));
    console.log(evt);
    // var result = JSON.parse(evt.explicitOriginalTarget.response);
    var result = JSON.parse(evt.currentTarget.response);
    console.log(result);

    var path = result['path'];
    var cost = result['cost'];

    alert(`Cost = ${cost}`);

    for (var i = 0 ; i < path.length-1 ; i++){        
        // {from: 1, to: 8, arrows:'to', dashes:true}    
        // console.log(res.items[i]); 
        edges.add({
            id: 'soradanIzafa'+i,
            from: path[i] ,
            to: path[i+1],
            label:i,
            color:{color:'#ff0000', opacity:0.3} , 
            weight : 1 ,
            arrows:'to' 
        });
    }
    edges.add({
            id: 'soradanIzafa'+path.length,
            from: path[path.length-1] ,
            to: path[0],
            label:path.length,
            color:{color:'#ff0000', opacity:0.3} , 
            weight : 1 ,
            arrows:'to' 
        });


}

function Run() {
    Resullt();
}