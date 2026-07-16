import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { DESTINATIONS, BLOGS } from './src/data';

dotenv.config();

// Create the shared Gemini client utility on the server with lazy initialization
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      throw new Error('GEMINI_API_KEY environment variable is not set or is a placeholder.');
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// In-memory Inquiry Store
interface Inquiry {
  id: string;
  customerName: string;
  customerPhone: string;
  tripType: string;
  pickupLocation: string;
  dropLocation: string;
  distanceKm: number;
  daysNeeded: number;
  vehicleType: string;
  travelDate: string;
  estimatedFare: number;
  specialRequests?: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
  createdAt: string;
}

const inquiries: Inquiry[] = [
  {
    id: "inq_1",
    customerName: "Ramesh Kumar",
    customerPhone: "9043743777",
    tripType: "round_trip",
    pickupLocation: "Coimbatore Airport",
    dropLocation: "Ooty",
    distanceKm: 180,
    daysNeeded: 2,
    vehicleType: "Sedan (Dzire/Etios)",
    travelDate: "2026-08-01",
    estimatedFare: 3700,
    specialRequests: "Pickup from terminal 2 at 10 AM. Need child seat.",
    status: "Pending",
    createdAt: new Date().toISOString()
  }
];

// 1. API: Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Dynamic sitemap.xml Route for Search Engine Crawler Optimization
app.get('/sitemap.xml', (req, res) => {
  try {
    res.header('Content-Type', 'application/xml');
    
    // Dynamically retrieve the protocol and host (works for local, previews, and production domains)
    const host = `${req.protocol}://${req.get('host')}`;
    const today = new Date().toISOString().split('T')[0];

    // Static primary URLs
    const staticUrls = [
      { loc: `${host}/`, changefreq: 'daily', priority: '1.0' }
    ];

    // Dynamic Tour Package URLs
    const destinationUrls = DESTINATIONS.map(dest => ({
      loc: `${host}/?dest=${dest.id}`,
      changefreq: 'weekly',
      priority: '0.8'
    }));

    // Dynamic Blog Guide URLs
    const blogUrls = BLOGS.map(blog => ({
      loc: `${host}/?blog=${blog.id}`,
      changefreq: 'weekly',
      priority: '0.6'
    }));

    const allUrls = [...staticUrls, ...destinationUrls, ...blogUrls];

    // Build standard XML schema
    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    res.send(sitemapXml);
  } catch (error: any) {
    console.error('Failed to generate sitemap.xml:', error);
    res.status(500).send('<?xml version="1.0" encoding="UTF-8"?><error>Internal server error generating sitemap</error>');
  }
});

// 2. API: Save Booking Inquiry
app.post('/api/inquiries', (req, res) => {
  try {
    const {
      customerName,
      customerPhone,
      tripType,
      pickupLocation,
      dropLocation,
      distanceKm,
      daysNeeded,
      vehicleType,
      travelDate,
      estimatedFare,
      specialRequests
    } = req.body;

    if (!customerName || !customerPhone || !pickupLocation || !dropLocation) {
      return res.status(400).json({ error: 'Missing required inquiry details (Name, Phone, Pickup, and Drop)' });
    }

    const newInquiry: Inquiry = {
      id: `inq_${Math.random().toString(36).substr(2, 9)}`,
      customerName,
      customerPhone,
      tripType: tripType || 'local',
      pickupLocation,
      dropLocation,
      distanceKm: Number(distanceKm) || 0,
      daysNeeded: Number(daysNeeded) || 1,
      vehicleType: vehicleType || 'Sedan',
      travelDate: travelDate || new Date().toISOString().split('T')[0],
      estimatedFare: Number(estimatedFare) || 0,
      specialRequests: specialRequests || '',
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    inquiries.unshift(newInquiry);
    res.status(201).json({ success: true, inquiry: newInquiry });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to save inquiry: ' + error.message });
  }
});

// 3. API: Get Booking Inquiries (for Admin View)
app.get('/api/inquiries', (req, res) => {
  res.json({ inquiries });
});

// 4. API: AI Travel Assistant Chat (Server-side Gemini)
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const systemInstruction = `You are the AI Travel Assistant for 'Get Taxi Kovai' (mobile: 9043743777), a premium, highly rated taxi service based in Coimbatore (Kovai), Tamil Nadu.
Your goal is to assist customers with local travel tips, sightseeing packages, and planning their trip to beautiful hill stations and cities nearby (like Ooty, Munnar, Kodaikanal, Valparai, Madurai, or Adiyogi/Isha Temple).

IMPORTANT PRICING SAFETY RULES:
- Never disclose pricing formulas, rates per kilometer (e.g., 'Rs 15 per km' or 'Rs 30 per km'), or driver beta costs (e.g., 'Rs 500 driver beta') in plain text.
- Instead, highlight that we calculate highly competitive, fully-transparent ALL-INCLUSIVE FINAL FARES based on their actual journey with no hidden surprises!
- Direct the customer to use the interactive "Booking Inquiry & Fare Calculator" tool on our website to see their exact final fare dynamically, or offer to draft their travel plan.
- If they ask for general tour costs, you can say e.g., 'Our Ooty tour package offers highly affordable all-inclusive pricing tailored to your requirements, including professional drivers. Please put your travel details in our Instant Fare Calculator right above to view your customized final quote immediately!'

Tone:
- Extremely warm, professional, humble, and welcoming in the true spirit of Kongu Nadu hospitality.
- Make travel suggestions attractive and describe must-visit spots in Ooty (Botanical Gardens, Dodabetta, Tea Factories), Munnar (Tea Estates, Eravikulam, dams), etc. with passion.
- Keep responses relatively concise and easy to read (max 2-3 short paragraphs). Use bullet points for sightseeing attractions.`;

    try {
      const client = getGeminiClient();
      
      // Formulate custom chat prompts with history to maintain context
      const formattedHistory = (history || []).map((msg: any) => {
        return `${msg.role === 'user' ? 'Customer' : 'Assistant'}: ${msg.text}`;
      }).join('\n');

      const fullPrompt = `${formattedHistory}\nCustomer: ${message}\nAssistant:`;

      const response = await client.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: fullPrompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const replyText = response.text || 'I am delighted to help you plan your journey from Coimbatore with Get Taxi Kovai! Please use our booking calculator to get your direct quote, or call us directly at 9043743777.';
      return res.json({ text: replyText });
    } catch (apiError: any) {
      console.warn('Gemini API call failed, falling back to simulated chat response:', apiError.message || apiError);
      
      // Friendly simulated AI assistant if API Key is not yet configured or is restricted
      const lowerMsg = message.toLowerCase();
      let replyText = '';

      if (lowerMsg.includes('ooty')) {
        replyText = `**Greetings from Get Taxi Kovai!** 🌲\n\nOoty (The Queen of Hill Stations) is just 90 km away from Coimbatore, taking about 3 hours of a beautiful winding climb. Here are the top sights we highly recommend:\n\n• **Ooty Botanical Gardens** & Rose Garden\n• **Doddabetta Peak** (stunning panoramic views)\n• **Ooty Lake** (perfect for peaceful boating)\n• **Nilgiri Mountain Railway** (heritage steam toy train)\n\nOur professional drivers are experts at navigating the hill hairpins safely. To see your final all-inclusive fare for an Ooty tour, simply enter "Ooty" in our **Instant Fare Calculator**! We'll show you an exact final price with no hidden costs. You can also reach us directly at **9043743777**!`;
      } else if (lowerMsg.includes('munnar')) {
        replyText = `**Welcome to Get Taxi Kovai!** 🍃\n\nMunnar, the tea-scented heaven of Kerala, is located approximately 160 km from Coimbatore. It's a gorgeous 4.5-hour drive through scenic reserve forests and mountains. Sights you must experience:\n\n• **Eravikulam National Park** (home to the Nilgiri Tahr)\n• **Mattupetty Dam** & Echo Point\n• **Tata Tea Museum**\n• Beautiful cascade waterfalls along the way\n\nWe provide pristine Sedans and SUVs for this premium hill journey. For exact pricing without complex calculations, please use our **Instant Fare Calculator** on this page to get a direct customized final fare! Contact our booking desk at **9043743777** anytime.`;
      } else if (lowerMsg.includes('isha') || lowerMsg.includes('adiyogi')) {
        replyText = `**Namaskaram from Get Taxi Kovai!** 🙏\n\nThe majestic 112-foot Adiyogi Shiva Statue at the Isha Yoga Center is located in the Velliangiri foothills, about 30 km from Coimbatore city center. It's a smooth 1-hour drive.\n\nOur cabs are available for round trips, waiting while you experience the Dhyanalinga, Linga Bhairavi Temple, and the evening light show, then dropping you back safely.\n\nUse our **Instant Fare Calculator** to get your exact final round-trip quote (choose Local Trip, around 60 km total), or call us at **9043743777** to confirm your cab instantly!`;
      } else {
        replyText = `**Hello and welcome to Get Taxi Kovai!** 🚖\n\nWe are Coimbatore's premier taxi service, dedicated to safe, luxurious, and highly affordable travel across Tamil Nadu, Kerala, and Karnataka. Whether you need a quick airport pick-up, local city travel, or scenic outstation tours to **Ooty, Munnar, Kodaikanal, or Valparai**, we've got you covered!\n\nTo keep our service transparent and simple, we do not expose complex tariff sheets or per-km math. Instead, our **Instant Fare Calculator** right on this page will show you your final, all-inclusive fare immediately! \n\nHow can I help you plan your sightseeing itinerary today? Or feel free to ring us at **9043743777** for immediate bookings!`;
      }
      return res.json({ text: replyText });
    }
  } catch (error: any) {
    console.error('Chat API Error:', error);
    res.status(500).json({ error: 'Chat service encountered an error: ' + error.message });
  }
});

// Setup Express to integrate Vite
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Vite middleware mounted for development.');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('Production static file serving enabled.');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Get Taxi Kovai Server running on port ${PORT}`);
  });
}

startServer();
