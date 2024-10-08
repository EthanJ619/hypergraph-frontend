import * as d3 from "d3";
import { ColorEdgeHG } from "../classes/index"


var grafo = {}
var type;

export function hgColorEdgePlot({ graph } = {}, { preferences } = {}, { idColorEdge }) {  //花括号包裹的参数，表示需要传递一个对象，对象中包含同名属性；等号后表示如果没有传递该参数，会被赋予默认的空对象
    /* console.log(preferences);
    console.log(graph);
    console.log(idColorEdge); */
    if (graph !== undefined) {
        return plotColorEdge(graph, preferences, idColorEdge);
    }
    else {
        var graph = require("../../data.json");        //如果graph为空，就从本地读取json数据
        return plotColorEdge(graph, preferences, idColorEdge);
    }
}

function plotColorEdge(graph, preferences, idColorEdge) {
    type = "color-edge"

    /* 定义节点绘制大小 */
    var lNodeR = 0.2;
    var nodeR;
    if (preferences.sizeNodes == "default")
        nodeR = 20;
    else
        nodeR = Number(preferences.sizeNodes);

    /* 定义节点颜色 */
    var colorNodes;
    if (preferences.colorNodes == "default")
        colorNodes = "#DfDfDf";
    else
        colorNodes = peferences.colorNodes;

    /* console.log("NODER ：" + nodeR);
    console.log("COLORNODES ：" + colorNodes); */
    //var dataMarker = { id: 0, name: 'circle', path: 'M 0, 0  m -5, 0  a 5,5 0 1,0 10,0  a 5,5 0 1,0 -10,0', viewbox: '-6 -6 12 12' };

    //var nodeId = 0;
    var width = preferences.windowWidth, height = preferences.windowHeight;

    //var color = d3.scaleOrdinal(d3.schemeCategory10);

    //zoom handler
    var zoom = d3.zoom()
        .scaleExtent([1 / 2, 5])
        .on("zoom", zoomed);

    //drag handler
    var drag = d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);

    //svg creation
    var svg = d3.select("#hg-plot" + idColorEdge + "")
        .append("svg:svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "amazingViz")
        .call(zoom)
        .append("g");


    //defs creation for markers
    var defs = svg.append("defs");
    /*
        //force layout definition
        var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function (d) { return d.id; }))//.distance(80).strength(1))
        .force("charge", d3.forceManyBody().strength(-50).distanceMin(50).distanceMax(200))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collide", d3.forceCollide(50));*/
    var simulation = d3.forceSimulation()
        .force("x", d3.forceX(width / 2).strength(0.35))
        .force("y", d3.forceY(height / 2).strength(0.4))
        .force("charge", d3.forceManyBody().strength(-2500))
        .force("link", d3.forceLink().id(d => d.id))
        .force("collide", d3.forceCollide().radius(d => d.r * 10))


    //data reading from json file
    var nodes = graph.nodes,
        links = graph.links,
        bilinks = [];
    grafo = JSON.parse(JSON.stringify(graph));              //d3.hypergraph invocation passing links and nodes
    var data = new ColorEdgeHG(links, nodes, graph.nodelink);

    //d3.hypergraph links
    links = data.hyper;
    //d3.hypergraph nodes
    nodes = data.nodes;

    var dictNodes = data.dictNodeLinks
    var dictLinks = data.dictLinks
    var dictNodeLinks = data.dictNodeLinks
    //node mapping by id
    var nodeById = d3.map(nodes, function (d) { return d.id; });

    /**
     * links
     * 
     * ###Example
     * '''
     * if is a hyperedge
     * source = {
     *           id: "5"                        id of the node
     *           links:["2"]                    links of the node
     *           }
     * target = {
     *           id: "Link:2-ln2,5,6,9,10"      target of the node
     *           linkid: "2"                    id of the link
     *           type: "hyperedge"              type of the edge
     *          }
     * 
     * if is an edge
     * source = {
     *           id: "4"                        id of the node
     *           links:["3", "4"]               links of the node
     *          }
     * target = {
     *           id: "8"                        target of the node, is just a node because is an edge
     *           linkid: "4"                    id of the link
     *           type: "edge"                   type of the edge
     *          }
     * 
     * if is a selfloop
     * source = {
     *           id: "6"                        id of the node
     *           links:["1", "2"]               links of the node
     *          }
     * target = {
     *           id: "6"                        target him self, cause is a selfloop
     *           linkid: "2"                    id of the link
     *           type: "selfloop"               type of the edge
     *          }
     */
    links.forEach(function (link) {
        var s = link.source = nodeById.get(link.source),
            t = link.target = nodeById.get(link.target),
            i = {}; // intermediate node
        if (t.id == s.id) {
            t = {
                link: null,
                size: link.size
            }
        }
        t["linkid"] = link.linkid;
        t["type"] = link.type;
        nodes.push(i);
        links.push({ source: s, target: i }, { source: i, target: t });
        bilinks.push([s, i, t]);
    });


    var colorEdges = {};
    bilinks.forEach(function (element, i) {
        if (preferences["colorEdges"] == "default") {
            colorEdges[(element[2].linkid + element[2].id) + ""] = getRandomColor();
        }
        else
            colorEdges[(element[2].linkid + element[2].id) + ""] = preferences["colorEdges"];
    });

    //links creation
    var link = svg.selectAll(".link")
        .data(bilinks)
        .enter().append("path")
        .attr("class", "link")
        // .attr("marker-start", "url(#circleMarker)")
        .attr("marker-mid", "url(#textMarker)")
        .attr("link-id", (d) => { return d[2].linkid; })
        /* .attr("marker-end", function (d) {
            if (d[2].type == "selfloop" || d[2].type == "edge")                //if (!d[2].link)
                return "url(#circleMarker)";
            else
                return "null";
        }) */
        .style("stroke", function (d) {
            return colorEdges[(d[2].linkid + d[2].id) + ""];          //color(d[2].linkid+d[2].id);
        })
        .style("stroke-width", "6px");

    //node creation
    var node = svg.selectAll(".node")
        .data(nodes.filter(function (d) {
            return d.id;
        }))
        .enter().append("g")
        .attr("class", "node")
        .attr("node-id", (d) => { return d.id; })
    //for every node -> svg circle creation
    node.append("circle")
        .attr("class", function (d) {
            if (d.link) {
                return "linknode";
            } else {
                return "node";
            }
        })
        .attr("r", function (d) {
            if (d.link) {
                return lNodeR;
            } else {
                return nodeR;
            }
        })
        .attr("fill", function (d) {
            if (d.link) {
                return "rgb(100,100,100)";
            } else {
                return colorNodes;
            }
        })
        .style("stroke-width", "3px")
        .style("stroke", "#909399");
    //id text
    node.append("text")
        .attr("dx", 25)
        .attr("dy", "-.5em")
        .text(function (d) {
            if (!d.link)
                return d.id;
            return null;
        })
        .style("font-weight", "bold")
        .style("font-size", "20px")
    link.append("title")
        .text(function (d, i) {
            if (d[2].type == "hyperedge") {
                //Example dictNodeLinks[node:2-Link:2-ln2,5,6,9,10]
                //Node:2 - Link:2 - Value:1
                return dictNodeLinks["node:" + d[0].id + "-" + d[2].id];
            }
            if (d[2].type == "selfloop") {
                //dictNodeLinks[node:6-Link1-SelfLoop:1]
                //Node:6 - Link:1 - Value:1
                return dictNodeLinks["node:" + d[0].id + "-Link:" + d[2].linkid + "-SelfLoop:" + d[2].linkid];
            }
            if (d[2].type == "edge") {
                var s = dictNodeLinks["node:" + d[2].id + "-Link:" + d[2].linkid + "-ln" + d[0].id + "," + d[2].id] + "\n" +
                    dictNodeLinks["node:" + d[0].id + "-Link:" + d[2].linkid + "-ln" + d[0].id + "," + d[2].id];
                if (s != undefined) return s;
                else {
                    s = dictNodeLinks["node:" + d[2].id + "-Link:" + d[2].linkid + "-ln" + d[2].id + "," + d[0].id] + "\n" +
                        dictNodeLinks["node:" + d[0].id + "-Link:" + d[2].linkid + "-ln" + d[2].id + "," + d[0].id];
                    return s;
                }
            }
        });
    //onmouseover id text
    node.append("title")
        .text(function (d) {
            if (!d.link)
                return d.id;
            return null;
        });

    node.call(drag);

    //sphere marker
    var marker = defs.append("marker")
        .attr("id", "circleMarker")
        .attr("markerHeight", 5)
        .attr("markerWidth", 5)
        .attr("markerUnits", "strokeWidth")
        .attr("orient", "auto")
        .attr("refX", 0)
        .attr("refY", 0)
        .attr("viewBox", "-6 -6 12 12")
        .append("path")
        .attr("d", "M 0, 0  m -5, 0  a 5,5 0 1,0 10,0  a 5,5 0 1,0 -10,0")
        .attr("fill", "black");

    simulation
        .nodes(nodes)
        .on("tick", ticked)
        .force("link")
        .links(links);
    function ticked() {
        link.attr("d", positionLink);
        node.attr("transform", positionNode);
    }
    function positionLink(d) {
        if (d[2].link == null && d[1].id == d[2].id) {
            var
                x1 = d[0].x,
                y1 = d[0].y,
                x2 = d[0].x,
                y2 = d[0].y,
                dx = x2 - x1,
                dy = y2 - y1,
                dr = Math.sqrt(dx * dx + dy * dy),

                // Defaults for normal edge.
                drx = dr,
                dry = dr,
                xRotation = 0, // degrees
                largeArc = 0, // 1 or 0
                sweep = 1; // 1 or 0

            // Self edge.
            if (x1 === x2 && y1 === y2) {
                // Fiddle with this angle to get loop oriented.
                xRotation = -45;

                // Needs to be 1.
                largeArc = 1;

                // Change sweep to change orientation of loop. 
                //sweep = 0;

                // Make drx and dry different to get an ellipse
                // instead of a circle.
                drx = d[2].size //d[2].linkid * 10;
                dry = d[2].size //d[2].linkid * 10;
                // For whatever reason the arc collapses to a point if the beginning
                // and ending points of the arc are the same, so kludge it.
                x2 = x2 + 1;
                y2 = y2 + 10;
                x1 = x1 + 10;
                y1 = y1 + 1;
                // invece attorno
                /*
                x2 = x2 + 20;
                y2 = y2 + 1;
                x1 = x1 + 1;
                y1 = y1 + 20;
                */
            }
            return "M" + x1 + "," + y1 + "A" + drx + "," + dry + " " + xRotation + "," + largeArc + "," + sweep + " " + x2 + "," + y2;
        }
        var diffX0, diffY0, diffX2, diffY2, pathLength01, pathLength12, offsetX0, offsetY0, offsetX2, offsetY2;

        diffX0 = d[0].x - d[1].x;
        diffY0 = d[0].y - d[1].y;
        diffX2 = d[2].x - d[1].x;
        diffY2 = d[2].y - d[1].y;

        pathLength01 = Math.sqrt((diffX0 * diffX0) + (diffY0 * diffY0));
        pathLength12 = Math.sqrt((diffX2 * diffX2) + (diffY2 * diffY2));

        offsetX0 = (diffX0 * nodeR) / pathLength01;
        offsetY0 = (diffY0 * nodeR) / pathLength01;
        if (!d[2].link) {
            offsetX2 = (diffX2 * nodeR) / pathLength12;
            offsetY2 = (diffY2 * nodeR) / pathLength12;
        } else {
            offsetX2 = (diffX2 * lNodeR) / pathLength12;
            offsetY2 = (diffY2 * lNodeR) / pathLength12;
        }

        var x0Pos, y0Pos, x2Pos, y2Pos;

        if (d[0].link) {
            x0Pos = d[0].x;
            y0Pos = d[0].y;
        } else {
            x0Pos = d[0].x - offsetX0;
            y0Pos = d[0].y - offsetY0;
        }
        if (d[2].link) {
            x2Pos = d[2].x;
            y2Pos = d[2].y;
        } else {
            x2Pos = d[2].x - offsetX2;
            y2Pos = d[2].y - offsetY2;
        }


        return "M" + x0Pos + "," + y0Pos
            + "S" + d[1].x + "," + d[1].y
            + " " + x2Pos + "," + y2Pos;
    }
    function positionNode(d) {
        return "translate(" + d.x + "," + d.y + ")";
    }
    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x, d.fy = d.y;
        d3.event.sourceEvent.stopPropagation();
    }
    function dragged(d) {
        d.fx = d3.event.x, d.fy = d3.event.y;
    }
    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null, d.fy = null;
    }
    function zoomed() {
        svg.attr("transform", d3.event.transform);
    }
    function getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    return svg;
}