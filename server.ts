import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- Mock Data Store ---
  let services = [
    { id: "1", name: "Premium Haircut", description: "Expert styling and cut for a fresh look.", price: 4500, duration: 45, category: "Salon", image: "https://picsum.photos/seed/hair/800/600" },
    { id: "2", name: "Full Body Massage", description: "Relaxing 60-minute massage therapy.", price: 8000, duration: 60, category: "Spa", image: "https://picsum.photos/seed/massage/800/600" },
    { id: "3", name: "Dental Checkup", description: "Routine cleaning and examination.", price: 12000, duration: 30, category: "Health", image: "https://picsum.photos/seed/dental/800/600" },
    { id: "4", name: "Personal Training", description: "One-on-one fitness coaching session.", price: 6000, duration: 60, category: "Fitness", image: "https://picsum.photos/seed/gym/800/600" },
  ];

  let bookings = [
    { id: "b1", serviceId: "1", userId: "u1", date: "2026-03-28", time: "10:00 AM", status: "confirmed", userName: "John Doe", userEmail: "john@example.com", userPhone: "123-456-7890" },
  ];

  let users = [
    { id: "u1", name: "John Doe", email: "john@example.com", password: "password", role: "user" },
    { id: "a1", name: "Admin User", email: "admin@reserveit.com", password: "adminpassword", role: "admin" },
  ];

  // --- API Routes ---

  // Auth
  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  });

  app.post("/api/auth/register", (req, res) => {
    const { name, email, password } = req.body;
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ message: "User already exists" });
    }
    const newUser = { id: `u${users.length + 1}`, name, email, password, role: "user" };
    users.push(newUser);
    const { password: _, ...userWithoutPassword } = newUser;
    res.json(userWithoutPassword);
  });

  // Services
  app.get("/api/services", (req, res) => res.json(services));
  app.get("/api/services/:id", (req, res) => {
    const service = services.find(s => s.id === req.params.id);
    service ? res.json(service) : res.status(404).json({ message: "Service not found" });
  });
  app.post("/api/services", (req, res) => {
    const newService = { ...req.body, id: String(services.length + 1) };
    services.push(newService);
    res.status(201).json(newService);
  });
  app.put("/api/services/:id", (req, res) => {
    const index = services.findIndex(s => s.id === req.params.id);
    if (index !== -1) {
      services[index] = { ...services[index], ...req.body };
      res.json(services[index]);
    } else {
      res.status(404).json({ message: "Service not found" });
    }
  });
  app.delete("/api/services/:id", (req, res) => {
    services = services.filter(s => s.id !== req.params.id);
    res.status(204).send();
  });

  // Bookings
  app.get("/api/bookings", (req, res) => res.json(bookings));
  app.get("/api/bookings/user/:userId", (req, res) => {
    res.json(bookings.filter(b => b.userId === req.params.userId));
  });
  app.post("/api/bookings", (req, res) => {
    const newBooking = { ...req.body, id: `b${bookings.length + 1}`, status: "pending" };
    bookings.push(newBooking);
    res.status(201).json(newBooking);
  });
  app.patch("/api/bookings/:id", (req, res) => {
    const index = bookings.findIndex(b => b.id === req.params.id);
    if (index !== -1) {
      bookings[index] = { ...bookings[index], ...req.body };
      res.json(bookings[index]);
    } else {
      res.status(404).json({ message: "Booking not found" });
    }
  });

  // Analytics
  app.get("/api/analytics", (req, res) => {
    res.json({
      totalBookings: bookings.length,
      activeUsers: users.length,
      totalServices: services.length,
      revenue: bookings.filter(b => b.status === 'confirmed').reduce((acc, b) => {
        const s = services.find(serv => serv.id === b.serviceId);
        return acc + (s ? s.price : 0);
      }, 0)
    });
  });

  // --- Vite / Static Serving ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
