let nodes = [];
let edges = [];
let selected = null;

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// CLICK HANDLER
canvas.addEventListener("click", (e) => {
    const x = e.offsetX;
    const y = e.offsetY;

    let idx = getNode(x, y);

    if (idx !== null) {
        if (selected === null) {
            selected = idx;
        } else {
            // prevent duplicate edges
            if (!edges.some(e => 
                (e[0] === selected && e[1] === idx) || 
                (e[0] === idx && e[1] === selected)
            )) {
                edges.push([selected, idx]);
            }
            selected = null;
        }
    } else {
        nodes.push({ x, y, colors: [] });
    }

    draw();
});

// FIND NODE
function getNode(x, y) {
    for (let i = 0; i < nodes.length; i++) {
        let dx = nodes[i].x - x;
        let dy = nodes[i].y - y;
        if (Math.sqrt(dx * dx + dy * dy) < 15) return i;
    }
    return null;
}

// DRAW GRAPH
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // edges
    edges.forEach(([a, b]) => {
        ctx.beginPath();
        ctx.moveTo(nodes[a].x, nodes[a].y);
        ctx.lineTo(nodes[b].x, nodes[b].y);
        ctx.strokeStyle = "white";
        ctx.stroke();
    });

    // nodes
    nodes.forEach((n, i) => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, 15, 0, 2 * Math.PI);

        // MULTI COLOR
        if (n.colors.length === 0) {
            ctx.fillStyle = "lightblue";
        } else if (n.colors.length === 1) {
            ctx.fillStyle = n.colors[0];
        } else {
            ctx.fillStyle = "purple";
        }

        ctx.fill();

        // selected node highlight
        if (i === selected) {
            ctx.strokeStyle = "yellow";
            ctx.lineWidth = 3;
            ctx.stroke();
        }

        ctx.fillStyle = "black";
        ctx.fillText(i, n.x - 5, n.y + 5);
    });
}

// RESET
function resetGraph() {
    nodes = [];
    edges = [];
    selected = null;
    draw();
}

// RUN ALGO
function runAlgo(type) {
    if (nodes.length === 0) {
        alert("Create at least one node!");
        return;
    }

    fetch("http://localhost:3000/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            nodesCount: nodes.length,
            edges: edges,
            type: type
        })
    })
    .then(res => res.json())
    .then(data => {
        console.log("RESULT:", data);

        if (type === "bfs") {
            visualize(data.result, "orange");
        } else {
            visualize(data.result, "green");
        }
    });
}

// VISUALIZATION
function visualize(order, color) {
    let i = 0;

    function step() {
        if (i >= order.length) return;

        let node = nodes[order[i]];

        if (!node.colors.includes(color)) {
            node.colors.push(color);
        }

        draw();

        i++;
        setTimeout(step, 600);
    }

    step();
}