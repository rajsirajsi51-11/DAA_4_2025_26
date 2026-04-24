#include <bits/stdc++.h>
using namespace std;

int main(int argc, char* argv[]) {
    string type = argv[1];

    int n;
    cin >> n;

    vector<vector<int>> graph(n);

    while (true) {
        int u, v;
        cin >> u >> v;
        if (u == -1 && v == -1) break;

        graph[u].push_back(v);
        graph[v].push_back(u);
    }

    vector<bool> visited(n, false);

    if (type == "bfs") {
        queue<int> q;
        q.push(0);

        while (!q.empty()) {
            int node = q.front(); q.pop();

            if (!visited[node]) {
                cout << node << " ";
                visited[node] = true;

                for (int nei : graph[node]) {
                    if (!visited[nei]) q.push(nei);
                }
            }
        }
    } else {
        function<void(int)> dfs = [&](int node) {
            visited[node] = true;
            cout << node << " ";

            for (int nei : graph[node]) {
                if (!visited[nei]) dfs(nei);
            }
        };

        dfs(0);
    }

    return 0;
}