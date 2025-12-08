import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
const PORT = 3000;

/* ============================
   🔌 Conexão com o MongoDB
============================ */
mongoose
  .connect("mongodb://127.0.0.1:27017/crud_complexo")
  .then(() => console.log("MongoDB conectado"))
  .catch(err => console.error("Erro no MongoDB:", err));

/* ============================
   🧬 Middleware global
============================ */
app.use(cors());
app.use(express.json());

// Middleware simples de autenticação
function auth(req, res, next) {
  const token = req.headers.authorization;

  if (!token || token !== "Bearer 12345") {
    return res.status(401).json({ error: "Não autorizado" });
  }

  next();
}

/* ============================
   📘 Modelo (Mongoose)
============================ */
const User = mongoose.model(
  "User",
  new mongoose.Schema(
    {
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      age: { type: Number, min: 1, max: 120 },
      createdAt: { type: Date, default: Date.now }
    },
    { versionKey: false }
  )
);

/* ============================
   🏗️ Rotas do CRUD
============================ */

// CREATE
app.post("/users", auth, async (req, res) => {
  try {
    const { name, email, age } = req.body;

    if (!name || !email)
      return res.status(400).json({ error: "Nome e email são obrigatórios" });

    const user = await User.create({ name, email, age });
    res.status(201).json(user);

  } catch (err) {
    if (err.code === 11000)
      return res.status(400).json({ error: "Email já registrado" });

    res.status(500).json({ error: "Erro ao criar usuário" });
  }
});

// READ (com filtros e paginação)
app.get("/users", auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, name } = req.query;

    const query = {};
    if (name) query.name = new RegExp(name, "i"); // busca parcial

    const users = await User.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await User.countDocuments(query);

    res.json({
      page: Number(page),
      pages: Math.ceil(total / limit),
      total,
      users
    });

  } catch {
    res.status(500).json({ error: "Erro ao listar usuários" });
  }
});

// READ by ID
app.get("/users/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

    res.json(user);

  } catch {
    res.status(500).json({ error: "Erro ao buscar usuário" });
  }
});

// UPDATE
app.put("/users/:id", auth, async (req, res) => {
  try {
    const { name, email, age } = req.body;

    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, age },
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ error: "Usuário não encontrado" });

    res.json(updated);

  } catch {
    res.status(500).json({ error: "Erro ao atualizar usuário" });
  }
});

// DELETE
app.delete("/users/:id", auth, async (req, res) => {
  try {
    const removed = await User.findByIdAndDelete(req.params.id);

    if (!removed)
      return res.status(404).json({ error: "Usuário não encontrado" });

    res.json({ message: "Usuário removido", removed });

  } catch {
    res.status(500).json({ error: "Erro ao deletar usuário" });
  }
});

/* ============================
   🚀 Iniciar servidor
============================ */
app.listen(PORT, () => console.log(`Servidor rodando: http://localhost:${PORT}`));