const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const port = 3000;

// Update CORS to allow frontend URL
app.use(
    cors({
        origin: "https://bookish-space-orbit-9xxrgjqjpv6fq4x-5173.app.github.dev", // Allow only this origin
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
    })
);

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "https://bookish-space-orbit-9xxrgjqjpv6fq4x-5173.app.github.dev", // Allow only this origin
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
    },
});

io.on("connection", (socket) => {
    console.log("Client connected with id: " + socket.id);
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
