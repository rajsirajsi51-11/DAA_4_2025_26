import tkinter as tk
from collections import deque

class GraphVisualizer:
    def __init__(self, root):
        self.root = root
        self.root.title("Graph Traversal Visualizer")

        self.canvas = tk.Canvas(root, width=600, height=400, bg="white")
        self.canvas.pack()

        self.nodes = []
        self.edges = {}
        self.node_positions = {}
        self.selected_node = None

        self.canvas.bind("<Button-1>", self.add_node)

        frame = tk.Frame(root)
        frame.pack()

        tk.Button(frame, text="Connect Nodes", command=self.connect_mode).pack(side=tk.LEFT)
        tk.Button(frame, text="Run BFS", command=self.run_bfs).pack(side=tk.LEFT)
        tk.Button(frame, text="Run DFS", command=self.run_dfs).pack(side=tk.LEFT)
        tk.Button(frame, text="Reset", command=self.reset).pack(side=tk.LEFT)

        self.connecting = False

    def add_node(self, event):
        if self.connecting:
            self.select_node(event)
            return

        node_id = len(self.nodes)
        x, y = event.x, event.y

        self.nodes.append(node_id)
        self.edges[node_id] = []
        self.node_positions[node_id] = (x, y)

        self.canvas.create_oval(x-15, y-15, x+15, y+15, fill="lightblue", tags=f"node{node_id}")
        self.canvas.create_text(x, y, text=str(node_id))

    def select_node(self, event):
        for node, (x, y) in self.node_positions.items():
            if (event.x - x)**2 + (event.y - y)**2 <= 15**2:
                if self.selected_node is None:
                    self.selected_node = node
                else:
                    self.edges[self.selected_node].append(node)
                    self.edges[node].append(self.selected_node)

                    x1, y1 = self.node_positions[self.selected_node]
                    x2, y2 = self.node_positions[node]

                    self.canvas.create_line(x1, y1, x2, y2)

                    self.selected_node = None
                break

    def connect_mode(self):
        self.connecting = True

    def reset(self):
        self.canvas.delete("all")
        self.nodes = []
        self.edges = {}
        self.node_positions = {}
        self.selected_node = None

    def highlight(self, node, color):
        x, y = self.node_positions[node]
        self.canvas.create_oval(x-15, y-15, x+15, y+15, fill=color)
        self.canvas.create_text(x, y, text=str(node))
        self.root.update()
        self.root.after(500)

    def run_bfs(self):
        if not self.nodes:
            return

        visited = set()
        queue = deque([self.nodes[0]])

        while queue:
            node = queue.popleft()
            if node not in visited:
                visited.add(node)
                self.highlight(node, "green")

                for neighbor in self.edges[node]:
                    if neighbor not in visited:
                        queue.append(neighbor)

    def run_dfs(self):
        if not self.nodes:
            return

        visited = set()
        self.dfs_util(self.nodes[0], visited)

    def dfs_util(self, node, visited):
        visited.add(node)
        self.highlight(node, "orange")

        for neighbor in self.edges[node]:
            if neighbor not in visited:
                self.dfs_util(neighbor, visited)


root = tk.Tk()
app = GraphVisualizer(root)
root.mainloop()