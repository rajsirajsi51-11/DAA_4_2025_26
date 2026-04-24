const express = require('express');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');
const path = require('path');

const app = express();
app.use(bodyParser.json());

// CORS FIX
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    next();
});

app.post('/run', (req, res) => {
    const { nodesCount, edges, type } = req.body;

    const exePath = path.join(__dirname, 'graph.exe'); // WINDOWS SAFE

    const processCpp = spawn(exePath, [type]);

    let input = nodesCount + "\n";

    edges.forEach(e => {
        input += e[0] + " " + e[1] + "\n";
    });

    input += "-1 -1\n";

    processCpp.stdin.write(input);
    processCpp.stdin.end();

    let output = "";

    processCpp.stdout.on('data', (data) => {
        output += data.toString();
    });

    processCpp.stderr.on('data', (err) => {
        console.error("C++ ERROR:", err.toString());
    });

    processCpp.on('close', () => {
        const result = output.trim() ? output.trim().split(/\s+/).map(Number) : [];
        res.json({ result });
    });
});

app.listen(3000, () => console.log("✅ Server running on port 3000"));