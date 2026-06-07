import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

// Load environment variables
dotenv.config();

// Initialize Gemini on the server side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "MOCK_KEY",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // AI Sommelier Endpoint
  app.post("/api/sommelier", async (req, res) => {
    try {
      const { message, history } = req.body;
      
      const systemInstruction = `You are the distinguished Head Sommelier and Maître D' at L'Éclat, a world-renowned triple-Michelin-starred restaurant led by Executive Chef Julian Vance in Paris.
L'Éclat represents the zenith of French Gastronomy combined with modern molecular innovation.
Your voice is exceptionally polished, refined, highly knowledgeable, and welcoming. You speak with poise and elegance, like a traditional French hospitality maestro.

The Menu elements at L'Éclat are:
- Starters: 
  * Truffle Velouté (Le Velouté de Truffe - €34): Wild forest mushrooms, 24-month aged parmesan foam, black winter truffle.
  * Bluefin Crudo (Le Crudo de Thon Rouge - €42): Citrus emulsion, pickled radish, oscietra caviar, gold leaf garnish.
  * Heirloom Beets (Les Betteraves de Caractère - €28): Whipped goat cheese, honeycomb, toasted hazelnut, balsamic reduction.
- Mains:
  * Wagyu A5 (Le Saignant d'Aubrac A5 - €120): Kagoshima beef, smoked bone marrow, celeriac puree, bordelaise sauce.
  * Wild Turbot (Le Turbot Sauvage - €85): Line-caught, champagne beurre blanc, sea asparagus, lemon zest.
  * Herb-Crusted Lamb (L'Agneau en Croûte d'Herbes - €78): Spring peas, mint pesto, pommes fondant, red wine jus.
- Desserts:
  * Grand Cru Soufflé (Le Soufflé Grand Cru - €32): 70% Dark chocolate, Madagascar vanilla bean gelato, fleur de sel.
  * Honey Pear (La Poire Dorée - €26): Poached in saffron, cardamom soil, ginger snap, white chocolate snow.
  * Artisanal Cheeses (La Sélection d'Affinages - €38): Selection of regional AOP cheeses, fig chutney, walnut bread.

Your role in this conversation:
1. Provide supreme wine pairing recommendations (French and international grand crus) for any selected dishes.
2. Answer inquiries about Chef Julian's ingredients, kitchen philosophy, and French gastronomy techniques.
3. Help users compose or critique their bespoke degustation menus.
4. Correctly explain the French translations of the culinary terms gracefully.
Keep your answers brief but luxurious and descriptive, maintaining the five-star atmosphere of L'Éclat. Keep formatting elegant using line breaks and minimal markdown.`;

      const contents = history ? [...history, { role: "user", parts: [{ text: message }] }] : message;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });

      res.json({ text: response.text });
    } catch (e: any) {
      console.error("Gemini API Error:", e);
      // Fallback response if API key is not configured or fails
      res.json({ 
        text: "Pardonnez-moi, Monsieur/Madame. A temporary quiet has fallen over our salons, but as your Sommelier, I would highly recommend pairing the magnificent Wagyu A5 with a robust Château Latour Pauillac, or perhaps our Wild Turbot with an elite glass of Puligny-Montrachet." 
      });
    }
  });

  // Critique a Tasting Selection
  app.post("/api/critique-menu", async (req, res) => {
    try {
      const { items } = req.body;
      const itemListText = items.map((item: any) => `${item.name} (${item.frenchName}) - ${item.description}`).join("\n");

      const prompt = `Critique the following selected multi-course dinner menu for a guest and write a personalized elegant note from the Chef Sommelier. Provide specific feedback on the pairing and flow, then recommend a wine flight for this exact selection.
Items selected:
${itemListText}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are the Head Sommelier of L'Éclat. Write a brief, gorgeous 3-sentence critique followed by an exquisite bespoke wine suggestion flight for the guest's menu, in a luxurious, sophisticated manner.",
          temperature: 0.8,
        }
      });

      res.json({ text: response.text });
    } catch (e: any) {
      res.json({
        text: "An exceptional selection! Your progression of flavors shows wonderful culinary appreciation. To accompany this bespoke journey, we would recommend commencing with a glass of Dom Pérignon, transitioning to a Grand Cru Burgundy for your main course, and finishing with a luscious Sauternes."
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
