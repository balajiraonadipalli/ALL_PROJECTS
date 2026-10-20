import { Router } from 'express';
import mongoose from 'mongoose';

const router = Router();

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true }
  },
  { timestamps: true }
);

const ListingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    images: [{ type: String }],
    pricePerNight: { type: Number, required: true, min: 0 },
    location: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      coordinates: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
      }
    },
    amenities: [{ type: String }],
    propertyType: { 
      type: String, 
      enum: ['apartment', 'house', 'condo', 'villa', 'studio', 'loft', 'other'],
      required: true 
    },
    roomType: { 
      type: String, 
      enum: ['entire', 'private', 'shared'],
      required: true 
    },
    maxGuests: { type: Number, required: true, min: 1 },
    bedrooms: { type: Number, required: true, min: 0 },
    bathrooms: { type: Number, required: true, min: 0 },
    host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Listing = mongoose.models.Listing || mongoose.model('Listing', ListingSchema);

// Seed sample data
router.post('/seed', async (req, res) => {
  try {
    // Clear existing data
    await Listing.deleteMany({});
    await User.deleteMany({});

    // Create sample host
    const host = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      passwordHash: '$2a$10$dummy.hash.for.demo'
    });

    // Sample listings
    const sampleListings = [
      {
        title: 'Cozy Studio in Mumbai',
        description: 'Beautiful studio apartment in the heart of Mumbai with modern amenities and great connectivity.',
        images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500'],
        pricePerNight: 3200,
        location: {
          address: '123 Marine Drive, Mumbai',
          city: 'Mumbai',
          state: 'Maharashtra',
          country: 'India',
          coordinates: { lat: 19.0760, lng: 72.8777 }
        },
        amenities: ['WiFi', 'Kitchen', 'AC', 'Parking'],
        propertyType: 'studio',
        roomType: 'entire',
        maxGuests: 2,
        bedrooms: 0,
        bathrooms: 1,
        host: host._id
      },
      {
        title: 'Luxury Villa in Goa',
        description: 'Spacious villa with private pool, perfect for a beach vacation in Goa.',
        images: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=500'],
        pricePerNight: 8500,
        location: {
          address: 'Beach Road, Calangute, Goa',
          city: 'Goa',
          state: 'Goa',
          country: 'India',
          coordinates: { lat: 15.4909, lng: 73.8278 }
        },
        amenities: ['Pool', 'WiFi', 'Kitchen', 'AC', 'Parking', 'Beach Access'],
        propertyType: 'villa',
        roomType: 'entire',
        maxGuests: 8,
        bedrooms: 3,
        bathrooms: 3,
        host: host._id
      },
      {
        title: 'Modern Apartment in Bangalore',
        description: 'Contemporary 2BHK apartment in tech hub of Bangalore with all modern facilities.',
        images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500'],
        pricePerNight: 4500,
        location: {
          address: 'Koramangala, Bangalore',
          city: 'Bangalore',
          state: 'Karnataka',
          country: 'India',
          coordinates: { lat: 12.9352, lng: 77.6245 }
        },
        amenities: ['WiFi', 'Kitchen', 'AC', 'Gym', 'Pool'],
        propertyType: 'apartment',
        roomType: 'entire',
        maxGuests: 4,
        bedrooms: 2,
        bathrooms: 2,
        host: host._id
      },
      {
        title: 'Heritage House in Delhi',
        description: 'Beautiful heritage house in Old Delhi with traditional architecture and modern comforts.',
        images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500'],
        pricePerNight: 2800,
        location: {
          address: 'Chandni Chowk, Delhi',
          city: 'Delhi',
          state: 'Delhi',
          country: 'India',
          coordinates: { lat: 28.6517, lng: 77.2219 }
        },
        amenities: ['WiFi', 'Kitchen', 'AC', 'Garden'],
        propertyType: 'house',
        roomType: 'entire',
        maxGuests: 3,
        bedrooms: 1,
        bathrooms: 1,
        host: host._id
      },
      {
        title: 'Mountain View Cabin in Manali',
        description: 'Charming wooden cabin with stunning mountain views, perfect for a peaceful retreat.',
        images: ['https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=500'],
        pricePerNight: 3800,
        location: {
          address: 'Old Manali, Himachal Pradesh',
          city: 'Manali',
          state: 'Himachal Pradesh',
          country: 'India',
          coordinates: { lat: 32.2432, lng: 77.1892 }
        },
        amenities: ['WiFi', 'Kitchen', 'Fireplace', 'Mountain View'],
        propertyType: 'house',
        roomType: 'entire',
        maxGuests: 4,
        bedrooms: 2,
        bathrooms: 1,
        host: host._id
      },
      {
        title: 'Beachfront Condo in Chennai',
        description: 'Luxurious beachfront condo with panoramic sea views and premium amenities.',
        images: ['https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=500'],
        pricePerNight: 6200,
        location: {
          address: 'ECR, Chennai',
          city: 'Chennai',
          state: 'Tamil Nadu',
          country: 'India',
          coordinates: { lat: 12.9041, lng: 80.2409 }
        },
        amenities: ['WiFi', 'Kitchen', 'AC', 'Pool', 'Beach Access', 'Gym'],
        propertyType: 'condo',
        roomType: 'entire',
        maxGuests: 6,
        bedrooms: 2,
        bathrooms: 2,
        host: host._id
      }
    ];

    const listings = await Listing.insertMany(sampleListings);

    res.json({
      message: 'Sample data seeded successfully',
      users: 1,
      listings: listings.length
    });
  } catch (error) {
    console.error('Error seeding data:', error);
    res.status(500).json({ error: 'Failed to seed data' });
  }
});

export default router;

// Seed experiences data
router.post('/experiences', async (_req, res) => {
  try {
    const Experience = mongoose.models.Experience; // defined in experiences.routes
    if (!Experience) {
      return res.status(500).json({ error: 'Experience model not found. Start server after loading experiences routes.' });
    }

    await Experience.deleteMany({});

    // Create a sample host for experiences
    const host = await User.findOne({ email: 'john@example.com' }) || await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      passwordHash: '$2a$10$dummy.hash.for.demo'
    });

    const samples = [
      // Airbnb Originals - Unique experiences
      {
        title: 'Celebrate Brazilian cuisine with Kátia Barbosa',
        description: 'Cook iconic Brazilian dishes with a legendary chef. Learn techniques, stories, and flavors behind Brazil\'s most beloved recipes.',
        images: ['https://images.unsplash.com/photo-1498654200943-1088dd4438ae?w=800'],
        pricePerGuest: 7507,
        location: { city: 'Rio de Janeiro', state: 'Rio de Janeiro', country: 'Brazil', address: 'Copacabana', coordinates: { lat: -22.9711, lng: -43.1822 } },
        category: 'food',
        duration: 3,
        maxGuests: 8,
        rating: 5,
        totalReviews: 128,
        label: 'original',
        highlights: ['Hands-on cooking', 'Chef secrets', 'Local ingredients'],
        host: host._id
      },
      {
        title: 'Carve marble with a third‑generation sculptor',
        description: 'Step into a Florentine workshop and learn classical marble carving techniques with an expert artisan.',
        images: ['https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800'],
        pricePerGuest: 5142,
        location: { city: 'Athens', state: 'Attica', country: 'Greece', address: 'Plaka', coordinates: { lat: 37.9715, lng: 23.7245 } },
        category: 'arts',
        duration: 2.5,
        maxGuests: 6,
        rating: 5,
        totalReviews: 64,
        label: 'original',
        highlights: ['Historic studio', 'All tools provided', 'Take home your work'],
        host: host._id
      },
      {
        title: 'Experience a sacred Buddhist ritual and yoga class',
        description: 'Reconnect with yourself through guided meditation, a gentle yoga flow, and a traditional blessing ceremony.',
        images: ['https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800'],
        pricePerGuest: 1337,
        location: { city: 'Chiang Mai', state: 'Chiang Mai', country: 'Thailand', address: 'Old City', coordinates: { lat: 18.7883, lng: 98.9853 } },
        category: 'wellness',
        duration: 2,
        maxGuests: 10,
        rating: 4.98,
        totalReviews: 210,
        label: 'original',
        highlights: ['Monk blessing', 'Tea ceremony', 'Yoga mat included'],
        host: host._id
      },
      {
        title: 'Savor organic matcha in a tea ceremony in Shibuya',
        description: 'Learn the ancient art of Japanese tea ceremony with a certified master in a traditional setting.',
        images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800'],
        pricePerGuest: 2616,
        location: { city: 'Tokyo', state: 'Tokyo', country: 'Japan', address: 'Shibuya', coordinates: { lat: 35.6762, lng: 139.6503 } },
        category: 'culture',
        duration: 1.5,
        maxGuests: 6,
        rating: 5,
        totalReviews: 89,
        label: 'original',
        highlights: ['Traditional kimono', 'Matcha tasting', 'Cultural insights'],
        host: host._id
      },
      {
        title: 'Seaside Kundalini Yoga above the Mediterranean',
        description: 'Practice yoga on a stunning cliffside platform overlooking the Mediterranean Sea at sunrise.',
        images: ['https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800'],
        pricePerGuest: 3600,
        location: { city: 'Marseille', state: 'Provence', country: 'France', address: 'Calanques', coordinates: { lat: 43.2965, lng: 5.3698 } },
        category: 'wellness',
        duration: 2,
        maxGuests: 12,
        rating: 5,
        totalReviews: 156,
        label: 'original',
        highlights: ['Ocean views', 'All levels welcome', 'Equipment provided'],
        host: host._id
      },
      {
        title: 'Prosecco Hills: discover a small producer',
        description: 'Visit a family-owned winery in the Prosecco region and learn about traditional winemaking methods.',
        images: ['https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800'],
        pricePerGuest: 2880,
        location: { city: 'Conegliano', state: 'Veneto', country: 'Italy', address: 'Prosecco Hills', coordinates: { lat: 45.8881, lng: 12.2967 } },
        category: 'food',
        duration: 3,
        maxGuests: 8,
        rating: 5,
        totalReviews: 73,
        label: 'original',
        highlights: ['Wine tasting', 'Vineyard tour', 'Local snacks'],
        host: host._id
      },

      // Popular experiences in India
      {
        title: 'Uncover Fontainhas\' heritage',
        description: 'Walk the colorful Latin Quarter of Panjim and discover art, music, and Goan-Portuguese history.',
        images: ['https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800'],
        pricePerGuest: 1100,
        location: { city: 'South Goa', state: 'Goa', country: 'India', address: 'Fontainhas', coordinates: { lat: 15.4989, lng: 73.8278 } },
        category: 'culture',
        duration: 2,
        maxGuests: 12,
        rating: 4.9,
        totalReviews: 340,
        label: 'popular',
        host: host._id
      },
      {
        title: 'Trek to a hidden waterfall in Goa\'s forest',
        description: 'Discover a secret waterfall through lush tropical forest with a local guide. Perfect for nature lovers.',
        images: ['https://images.unsplash.com/photo-1533777419517-3e4017e2e15a?w=800'],
        pricePerGuest: 2650,
        location: { city: 'South Goa', state: 'Goa', country: 'India', address: 'Dudhsagar', coordinates: { lat: 15.3144, lng: 74.3144 } },
        category: 'adventure',
        duration: 4,
        maxGuests: 8,
        rating: 4.99,
        totalReviews: 190,
        label: 'popular',
        highlights: ['Swimming allowed', 'Lunch included', 'Photography tips'],
        host: host._id
      },
      {
        title: 'Kayaking experience on the Chapora river',
        description: 'Paddle along mangroves at golden hour. Beginner friendly with safety briefing and guide.',
        images: ['https://images.unsplash.com/photo-1551632811-561732d1e306?w=800'],
        pricePerGuest: 2500,
        location: { city: 'South Goa', state: 'Goa', country: 'India', address: 'Chapora', coordinates: { lat: 15.6069, lng: 73.7353 } },
        category: 'adventure',
        duration: 1.5,
        maxGuests: 10,
        rating: 4.99,
        totalReviews: 190,
        label: 'popular',
        highlights: ['All equipment provided', 'Safety briefing', 'Refreshments'],
        host: host._id
      },
      {
        title: 'Get hooked on Fishing Anjuna',
        description: 'Learn traditional fishing techniques from local fishermen and enjoy fresh catch for lunch.',
        images: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800'],
        pricePerGuest: 1100,
        location: { city: 'South Goa', state: 'Goa', country: 'India', address: 'Anjuna Beach', coordinates: { lat: 15.5833, lng: 73.7333 } },
        category: 'adventure',
        duration: 3,
        maxGuests: 6,
        rating: 4.98,
        totalReviews: 87,
        label: 'popular',
        highlights: ['Traditional methods', 'Fresh seafood lunch', 'Local stories'],
        host: host._id
      },
      {
        title: 'Discover coastal paradise in Goa',
        description: 'Explore pristine beaches, hidden coves, and local fishing villages with a knowledgeable guide.',
        images: ['https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=800'],
        pricePerGuest: 1500,
        location: { city: 'South Goa', state: 'Goa', country: 'India', address: 'Palolem', coordinates: { lat: 15.0104, lng: 74.0235 } },
        category: 'nature',
        duration: 2.5,
        maxGuests: 15,
        rating: 4.94,
        totalReviews: 203,
        label: 'popular',
        highlights: ['Beach hopping', 'Local snacks', 'Photography'],
        host: host._id
      },
      {
        title: 'Explore sunrise trail',
        description: 'Hike to a scenic viewpoint for breathtaking sunrise views over the Arabian Sea.',
        images: ['https://images.unsplash.com/photo-1506905925346-14b5e4c0e6d1?w=800'],
        pricePerGuest: 1000,
        location: { city: 'South Goa', state: 'Goa', country: 'India', address: 'Cabo de Rama', coordinates: { lat: 15.0833, lng: 73.9167 } },
        category: 'nature',
        duration: 2,
        maxGuests: 12,
        rating: 4.96,
        totalReviews: 145,
        label: 'popular',
        highlights: ['Early morning start', 'Coffee provided', 'Stunning views'],
        host: host._id
      },
      {
        title: 'Embark on a heritage walk around Old Goa',
        description: 'Discover the UNESCO World Heritage churches and colonial architecture of Old Goa.',
        images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800'],
        pricePerGuest: 1100,
        location: { city: 'South Goa', state: 'Goa', country: 'India', address: 'Old Goa', coordinates: { lat: 15.5019, lng: 73.9114 } },
        category: 'culture',
        duration: 2.5,
        maxGuests: 20,
        rating: 4.93,
        totalReviews: 267,
        label: 'popular',
        highlights: ['UNESCO sites', 'Historical insights', 'Photo opportunities'],
        host: host._id
      },

      // Additional experiences in other Indian cities
      {
        title: 'Mumbai street food tour with a local',
        description: 'Taste authentic Mumbai street food while learning about the city\'s culinary culture.',
        images: ['https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800'],
        pricePerGuest: 1800,
        location: { city: 'Mumbai', state: 'Maharashtra', country: 'India', address: 'Crawford Market', coordinates: { lat: 18.9445, lng: 72.8320 } },
        category: 'food',
        duration: 3,
        maxGuests: 10,
        rating: 4.89,
        totalReviews: 156,
        label: 'popular',
        highlights: ['8+ food stops', 'Local guide', 'Vegetarian options'],
        host: host._id
      },
      {
        title: 'Delhi\'s hidden gems walking tour',
        description: 'Explore lesser-known corners of Delhi with a passionate local who knows the city\'s secrets.',
        images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'],
        pricePerGuest: 1200,
        location: { city: 'Delhi', state: 'Delhi', country: 'India', address: 'Chandni Chowk', coordinates: { lat: 28.6517, lng: 77.2219 } },
        category: 'culture',
        duration: 2.5,
        maxGuests: 8,
        rating: 4.87,
        totalReviews: 98,
        label: 'popular',
        highlights: ['Hidden alleys', 'Local stories', 'Photo spots'],
        host: host._id
      },
      {
        title: 'Bangalore tech startup experience',
        description: 'Visit innovative startups and meet entrepreneurs in India\'s Silicon Valley.',
        images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'],
        pricePerGuest: 2500,
        location: { city: 'Bangalore', state: 'Karnataka', country: 'India', address: 'Electronic City', coordinates: { lat: 12.8456, lng: 77.6603 } },
        category: 'culture',
        duration: 3,
        maxGuests: 6,
        rating: 4.92,
        totalReviews: 45,
        label: 'new',
        highlights: ['Startup visits', 'Networking', 'Innovation insights'],
        host: host._id
      }
    ];

    const docs = await Experience.insertMany(samples);
    res.json({ message: 'Experiences seeded successfully', experiences: docs.length });
  } catch (e) {
    console.error('Seed experiences error:', e);
    res.status(500).json({ error: 'Failed to seed experiences' });
  }
});

// Seed services
router.post('/services', async (_req, res) => {
  try {
    const Service = mongoose.models.Service;
    if (!Service) {
      return res.status(500).json({ error: 'Service model not found. Start server after loading services routes.' });
    }

    await Service.deleteMany({});

    const host = await User.findOne({ email: 'john@example.com' }) || await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      passwordHash: '$2a$10$dummy.hash.for.demo'
    });

    const samples = [
      // Chefs
      {
        title: 'Hyperlocal, foraged fare by Clair',
        description: 'Join Clair for an intimate dining experience featuring locally foraged ingredients and innovative cooking techniques. Learn about sustainable gastronomy while enjoying a multi-course meal.',
        images: ['https://images.unsplash.com/photo-1498654200943-1088dd4438ae?w=800'],
        pricePerGuest: 8735,
        minimumBooking: 16763,
        location: { city: 'South Goa', state: 'Goa', country: 'India', coordinates: { lat: 15.2993, lng: 74.1240 } },
        category: 'chefs',
        subcategory: 'fine-dining',
        duration: 3,
        maxGuests: 8,
        rating: 5.0,
        totalReviews: 47,
        label: 'popular',
        highlights: ['Foraged ingredients', 'Sustainable cooking', 'Multi-course meal'],
        provider: {
          name: 'Clair',
          bio: 'Award-winning chef specializing in sustainable gastronomy',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
          verified: true
        },
        host: host._id,
        availability: 'available'
      },
      {
        title: 'Authentic Roman meal',
        description: 'Experience traditional Roman cuisine with authentic recipes passed down through generations. Learn to make classic pasta dishes and enjoy a family-style Italian feast.',
        images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800'],
        pricePerGuest: 6685,
        location: { city: 'South Goa', state: 'Goa', country: 'India', coordinates: { lat: 15.2993, lng: 74.1240 } },
        category: 'chefs',
        subcategory: 'italian-cuisine',
        duration: 2.5,
        maxGuests: 6,
        rating: 4.97,
        totalReviews: 23,
        label: 'new',
        highlights: ['Traditional recipes', 'Handmade pasta', 'Family-style dining'],
        provider: {
          name: 'Marco',
          bio: 'Roman chef with 15 years of experience in authentic Italian cuisine',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
          verified: true
        },
        host: host._id,
        availability: 'available'
      },
      {
        title: 'Behind the flame and fusion flavors by Erick',
        description: 'Discover the art of fusion cooking with Erick as he combines traditional techniques with modern flavors. Watch live cooking demonstrations and taste innovative dishes.',
        images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800'],
        pricePerGuest: 5745,
        minimumBooking: 10054,
        location: { city: 'South Goa', state: 'Goa', country: 'India', coordinates: { lat: 15.2993, lng: 74.1240 } },
        category: 'chefs',
        subcategory: 'fusion-cuisine',
        duration: 2,
        maxGuests: 10,
        rating: 5.0,
        totalReviews: 31,
        label: 'popular',
        highlights: ['Fusion cooking', 'Live demonstrations', 'Innovative flavors'],
        provider: {
          name: 'Erick',
          bio: 'Creative chef known for innovative fusion cuisine',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
          verified: true
        },
        host: host._id,
        availability: 'available'
      },
      {
        title: 'Luxury Private Dining by Chef Jimmy Matiz',
        description: 'Indulge in an exclusive fine dining experience with Chef Jimmy Matiz. Enjoy a personalized menu crafted just for you in an intimate setting.',
        images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800'],
        pricePerGuest: 14558,
        minimumBooking: 114695,
        location: { city: 'South Goa', state: 'Goa', country: 'India', coordinates: { lat: 15.2993, lng: 74.1240 } },
        category: 'chefs',
        subcategory: 'luxury-dining',
        duration: 4,
        maxGuests: 4,
        rating: 5.0,
        totalReviews: 12,
        label: 'popular',
        highlights: ['Exclusive experience', 'Personalized menu', 'Intimate setting'],
        provider: {
          name: 'Chef Jimmy Matiz',
          bio: 'Michelin-starred chef specializing in luxury dining experiences',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
          verified: true
        },
        host: host._id,
        availability: 'available'
      },
      {
        title: 'Vibrant Cali-Mediterranean menus by Liza',
        description: 'Experience the fresh, vibrant flavors of California-Mediterranean fusion cuisine. Learn to create healthy, colorful dishes that celebrate local ingredients.',
        images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800'],
        pricePerGuest: 14999,
        minimumBooking: 70582,
        location: { city: 'South Goa', state: 'Goa', country: 'India', coordinates: { lat: 15.2993, lng: 74.1240 } },
        category: 'chefs',
        subcategory: 'mediterranean-cuisine',
        duration: 3.5,
        maxGuests: 8,
        rating: 5.0,
        totalReviews: 19,
        label: 'new',
        highlights: ['Fresh ingredients', 'Healthy cooking', 'Colorful presentation'],
        provider: {
          name: 'Liza',
          bio: 'Health-focused chef specializing in Mediterranean cuisine',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
          verified: true
        },
        host: host._id,
        availability: 'available'
      },
      {
        title: 'Catalan cuisine by Cristina',
        description: 'Discover the rich flavors of Catalan cuisine with traditional recipes from Barcelona. Learn about Spanish cooking techniques and enjoy authentic tapas.',
        images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800'],
        pricePerGuest: 4114,
        location: { city: 'South Goa', state: 'Goa', country: 'India', coordinates: { lat: 15.2993, lng: 74.1240 } },
        category: 'chefs',
        subcategory: 'spanish-cuisine',
        duration: 2,
        maxGuests: 12,
        rating: 4.8,
        totalReviews: 15,
        label: 'new',
        highlights: ['Traditional recipes', 'Spanish techniques', 'Authentic tapas'],
        provider: {
          name: 'Cristina',
          bio: 'Barcelona-born chef with expertise in Catalan cuisine',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
          verified: true
        },
        host: host._id,
        availability: 'available'
      },
      {
        title: 'International gourmet fusion by Brian',
        description: 'Explore global flavors with Brian\'s innovative approach to international cuisine. Experience a culinary journey around the world in one meal.',
        images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800'],
        pricePerGuest: 7941,
        location: { city: 'South Goa', state: 'Goa', country: 'India', coordinates: { lat: 15.2993, lng: 74.1240 } },
        category: 'chefs',
        subcategory: 'international-cuisine',
        duration: 2.5,
        maxGuests: 8,
        rating: 4.9,
        totalReviews: 27,
        label: 'new',
        highlights: ['Global flavors', 'Culinary journey', 'Innovative techniques'],
        provider: {
          name: 'Brian',
          bio: 'World-traveled chef with expertise in international cuisine',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
          verified: true
        },
        host: host._id,
        availability: 'available'
      },
      // Training
      {
        title: 'Personal Training w/ Dayton',
        description: 'Get fit with personalized training sessions designed for your goals. Dayton will create a custom workout plan and provide motivation to help you achieve your fitness targets.',
        images: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800'],
        pricePerGuest: 2500,
        location: { city: 'South Goa', state: 'Goa', country: 'India', coordinates: { lat: 15.2993, lng: 74.1240 } },
        category: 'training',
        subcategory: 'personal-training',
        duration: 1,
        maxGuests: 1,
        rating: 4.9,
        totalReviews: 45,
        label: 'popular',
        highlights: ['Personalized workouts', 'Goal-oriented training', 'Professional guidance'],
        provider: {
          name: 'Dayton',
          bio: 'Certified personal trainer with 8 years of experience',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
          verified: true
        },
        host: host._id,
        availability: 'available'
      },
      {
        title: 'Yoga and embodiment by Julia',
        description: 'Connect with your body and mind through gentle yoga practices. Julia will guide you through poses, breathing exercises, and meditation for complete wellness.',
        images: ['https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800'],
        pricePerGuest: 1800,
        location: { city: 'South Goa', state: 'Goa', country: 'India', coordinates: { lat: 15.2993, lng: 74.1240 } },
        category: 'training',
        subcategory: 'yoga',
        duration: 1.5,
        maxGuests: 15,
        rating: 4.8,
        totalReviews: 32,
        label: 'new',
        highlights: ['Gentle yoga', 'Breathing exercises', 'Meditation'],
        provider: {
          name: 'Julia',
          bio: 'Certified yoga instructor specializing in mindful movement',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
          verified: true
        },
        host: host._id,
        availability: 'available'
      },
      {
        title: 'Total body training by Peter',
        description: 'Build strength and endurance with Peter\'s comprehensive total body workout. Perfect for all fitness levels with modifications available.',
        images: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800'],
        pricePerGuest: 2200,
        location: { city: 'South Goa', state: 'Goa', country: 'India', coordinates: { lat: 15.2993, lng: 74.1240 } },
        category: 'training',
        subcategory: 'strength-training',
        duration: 1,
        maxGuests: 8,
        rating: 4.7,
        totalReviews: 28,
        label: 'new',
        highlights: ['Strength building', 'Endurance training', 'All fitness levels'],
        provider: {
          name: 'Peter',
          bio: 'Strength and conditioning specialist',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
          verified: true
        },
        host: host._id,
        availability: 'available'
      },
      {
        title: 'Personal Training & Group Fitness',
        description: 'Choose between one-on-one personal training or join our energizing group fitness classes. Flexible options to fit your schedule and preferences.',
        images: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800'],
        pricePerGuest: 2000,
        location: { city: 'South Goa', state: 'Goa', country: 'India', coordinates: { lat: 15.2993, lng: 74.1240 } },
        category: 'training',
        subcategory: 'mixed-training',
        duration: 1,
        maxGuests: 12,
        rating: 4.6,
        totalReviews: 41,
        label: 'new',
        highlights: ['Flexible options', 'Group classes', 'Personal attention'],
        provider: {
          name: 'Fitness Team',
          bio: 'Professional fitness trainers with diverse specialties',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
          verified: true
        },
        host: host._id,
        availability: 'available'
      },
      {
        title: 'Restorative fitness by Taylor',
        description: 'Focus on recovery and gentle movement with Taylor\'s restorative fitness approach. Perfect for those looking to improve flexibility and reduce stress.',
        images: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800'],
        pricePerGuest: 1600,
        location: { city: 'South Goa', state: 'Goa', country: 'India', coordinates: { lat: 15.2993, lng: 74.1240 } },
        category: 'training',
        subcategory: 'restorative-fitness',
        duration: 1.5,
        maxGuests: 10,
        rating: 4.9,
        totalReviews: 19,
        label: 'new',
        highlights: ['Recovery focused', 'Gentle movement', 'Stress reduction'],
        provider: {
          name: 'Taylor',
          bio: 'Specialist in restorative and therapeutic fitness',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
          verified: true
        },
        host: host._id,
        availability: 'available'
      },
      {
        title: 'High-energy workouts by Vicky',
        description: 'Get your heart pumping with Vicky\'s high-energy workout sessions. Perfect for those who love intense, fun fitness challenges.',
        images: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800'],
        pricePerGuest: 1900,
        location: { city: 'South Goa', state: 'Goa', country: 'India', coordinates: { lat: 15.2993, lng: 74.1240 } },
        category: 'training',
        subcategory: 'high-intensity',
        duration: 1,
        maxGuests: 20,
        rating: 4.8,
        totalReviews: 36,
        label: 'popular',
        highlights: ['High energy', 'Fun challenges', 'Group motivation'],
        provider: {
          name: 'Vicky',
          bio: 'High-energy fitness instructor and motivational coach',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
          verified: true
        },
        host: host._id,
        availability: 'available'
      },
      {
        title: 'Sun-sweat by Nishant',
        description: 'Experience outdoor fitness with Nishant\'s beach and nature-based workouts. Combine exercise with the beauty of Goa\'s natural surroundings.',
        images: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800'],
        pricePerGuest: 1700,
        location: { city: 'South Goa', state: 'Goa', country: 'India', coordinates: { lat: 15.2993, lng: 74.1240 } },
        category: 'training',
        subcategory: 'outdoor-fitness',
        duration: 1.5,
        maxGuests: 15,
        rating: 4.9,
        totalReviews: 24,
        label: 'new',
        highlights: ['Outdoor workouts', 'Beach fitness', 'Nature connection'],
        provider: {
          name: 'Nishant',
          bio: 'Outdoor fitness specialist and nature enthusiast',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
          verified: true
        },
        host: host._id,
        availability: 'available'
      },
      // Photography
      {
        title: 'Professional Photography Session',
        description: 'Capture your memories with a professional photography session. Perfect for couples, families, or solo travelers looking for stunning photos.',
        images: ['https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800'],
        pricePerGuest: 5000,
        location: { city: 'South Goa', state: 'Goa', country: 'India', coordinates: { lat: 15.2993, lng: 74.1240 } },
        category: 'photography',
        subcategory: 'portrait-photography',
        duration: 2,
        maxGuests: 4,
        rating: 4.9,
        totalReviews: 67,
        label: 'popular',
        highlights: ['Professional quality', 'Multiple locations', 'Edited photos'],
        provider: {
          name: 'Raj Photography',
          bio: 'Professional photographer with 10+ years of experience',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
          verified: true
        },
        host: host._id,
        availability: 'available'
      },
      // Coming Soon Services
      {
        title: 'Luxury Massage Therapy',
        description: 'Relax and rejuvenate with our luxury massage therapy services. Professional therapists will help you unwind and de-stress.',
        images: ['https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800'],
        pricePerGuest: 3500,
        location: { city: 'South Goa', state: 'Goa', country: 'India', coordinates: { lat: 15.2993, lng: 74.1240 } },
        category: 'massage',
        subcategory: 'luxury-massage',
        duration: 1.5,
        maxGuests: 1,
        rating: 0,
        totalReviews: 0,
        label: 'coming-soon',
        highlights: ['Luxury experience', 'Professional therapists', 'Relaxation'],
        provider: {
          name: 'Spa Wellness',
          bio: 'Luxury spa and wellness services',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
          verified: true
        },
        host: host._id,
        availability: 'coming-soon'
      },
      {
        title: 'Professional Makeup Services',
        description: 'Get ready for special occasions with our professional makeup services. Expert artists will help you look your absolute best.',
        images: ['https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800'],
        pricePerGuest: 2500,
        location: { city: 'South Goa', state: 'Goa', country: 'India', coordinates: { lat: 15.2993, lng: 74.1240 } },
        category: 'makeup',
        subcategory: 'special-occasion',
        duration: 2,
        maxGuests: 1,
        rating: 0,
        totalReviews: 0,
        label: 'coming-soon',
        highlights: ['Professional artists', 'Special occasions', 'Premium products'],
        provider: {
          name: 'Beauty Studio',
          bio: 'Professional makeup and beauty services',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
          verified: true
        },
        host: host._id,
        availability: 'coming-soon'
      },
      {
        title: 'Hair Styling & Treatment',
        description: 'Transform your look with our professional hair styling and treatment services. From cuts to color, we have you covered.',
        images: ['https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800'],
        pricePerGuest: 2000,
        location: { city: 'South Goa', state: 'Goa', country: 'India', coordinates: { lat: 15.2993, lng: 74.1240 } },
        category: 'hair',
        subcategory: 'styling-treatment',
        duration: 2.5,
        maxGuests: 1,
        rating: 0,
        totalReviews: 0,
        label: 'coming-soon',
        highlights: ['Professional styling', 'Hair treatments', 'Color services'],
        provider: {
          name: 'Hair Studio',
          bio: 'Professional hair styling and treatment specialists',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
          verified: true
        },
        host: host._id,
        availability: 'coming-soon'
      },
      {
        title: 'Spa Treatments & Wellness',
        description: 'Indulge in our comprehensive spa treatments and wellness services. From facials to body treatments, relax and rejuvenate.',
        images: ['https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800'],
        pricePerGuest: 4000,
        location: { city: 'South Goa', state: 'Goa', country: 'India', coordinates: { lat: 15.2993, lng: 74.1240 } },
        category: 'spa',
        subcategory: 'wellness-treatments',
        duration: 3,
        maxGuests: 1,
        rating: 0,
        totalReviews: 0,
        label: 'coming-soon',
        highlights: ['Comprehensive treatments', 'Wellness focus', 'Luxury experience'],
        provider: {
          name: 'Wellness Spa',
          bio: 'Comprehensive spa and wellness treatment center',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
          verified: true
        },
        host: host._id,
        availability: 'coming-soon'
      },
      {
        title: 'Catering Services',
        description: 'Professional catering services for events and special occasions. From intimate dinners to large gatherings, we cater to all needs.',
        images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800'],
        pricePerGuest: 1500,
        minimumBooking: 10000,
        location: { city: 'South Goa', state: 'Goa', country: 'India', coordinates: { lat: 15.2993, lng: 74.1240 } },
        category: 'catering',
        subcategory: 'event-catering',
        duration: 4,
        maxGuests: 50,
        rating: 0,
        totalReviews: 0,
        label: 'coming-soon',
        highlights: ['Event catering', 'Custom menus', 'Professional service'],
        provider: {
          name: 'Event Caterers',
          bio: 'Professional catering services for all occasions',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
          verified: true
        },
        host: host._id,
        availability: 'coming-soon'
      },
      {
        title: 'Prepared Meals Delivery',
        description: 'Enjoy delicious, healthy prepared meals delivered to your door. Perfect for busy travelers who want quality food without the hassle.',
        images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800'],
        pricePerGuest: 800,
        location: { city: 'South Goa', state: 'Goa', country: 'India', coordinates: { lat: 15.2993, lng: 74.1240 } },
        category: 'prepared-meals',
        subcategory: 'meal-delivery',
        duration: 0.5,
        maxGuests: 10,
        rating: 0,
        totalReviews: 0,
        label: 'coming-soon',
        highlights: ['Healthy meals', 'Door delivery', 'Convenient'],
        provider: {
          name: 'Meal Prep Co',
          bio: 'Healthy prepared meals delivered fresh',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
          verified: true
        },
        host: host._id,
        availability: 'coming-soon'
      },
      {
        title: 'Nail Art & Manicure',
        description: 'Pamper yourself with our professional nail art and manicure services. From classic styles to creative designs, express your personality.',
        images: ['https://images.unsplash.com/photo-1604654891980-b0aa7a0b4a0a?w=800'],
        pricePerGuest: 1200,
        location: { city: 'South Goa', state: 'Goa', country: 'India', coordinates: { lat: 15.2993, lng: 74.1240 } },
        category: 'nails',
        subcategory: 'nail-art',
        duration: 1.5,
        maxGuests: 1,
        rating: 0,
        totalReviews: 0,
        label: 'coming-soon',
        highlights: ['Nail art', 'Professional manicure', 'Creative designs'],
        provider: {
          name: 'Nail Studio',
          bio: 'Professional nail art and manicure specialists',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
          verified: true
        },
        host: host._id,
        availability: 'coming-soon'
      }
    ];

    const docs = await Service.insertMany(samples);
    res.json({ message: 'Services seeded successfully', services: docs.length });
  } catch (e) {
    console.error('Seed services error:', e);
    res.status(500).json({ error: 'Failed to seed services' });
  }
});

// Seed experience reviews
router.post('/experience-reviews', async (_req, res) => {
  try {
    const Review = mongoose.models.Review;
    if (!Review) {
      return res.status(500).json({ error: 'Review model not found. Start server after loading reviews routes.' });
    }

    const Experience = mongoose.models.Experience;
    if (!Experience) {
      return res.status(500).json({ error: 'Experience model not found.' });
    }

    // Get some experiences to add reviews to
    const experiences = await Experience.find().limit(5);
    if (experiences.length === 0) {
      return res.status(400).json({ error: 'No experiences found. Seed experiences first.' });
    }

    // Get or create a guest user
    const guest = await User.findOne({ email: 'guest@example.com' }) || await User.create({
      name: 'Guest User',
      email: 'guest@example.com',
      passwordHash: '$2a$10$dummy.hash.for.demo'
    });

    // Sample reviews
    const reviewSamples = [
      {
        experience: experiences[0]._id,
        guest: guest._id,
        overallRating: 5,
        comment: 'Absolutely amazing experience! The host was incredibly knowledgeable and made everything so engaging. Highly recommend this to anyone visiting the area.',
        isPublic: true
      },
      {
        experience: experiences[0]._id,
        guest: guest._id,
        overallRating: 4,
        comment: 'Great experience overall. The activities were fun and the host was very friendly. Would definitely do this again.',
        isPublic: true
      },
      {
        experience: experiences[1]?._id,
        guest: guest._id,
        overallRating: 5,
        comment: 'This was one of the best experiences I\'ve had! The host went above and beyond to make sure everyone had a great time.',
        isPublic: true
      },
      {
        experience: experiences[2]?._id,
        guest: guest._id,
        overallRating: 4,
        comment: 'Really enjoyed this experience. The location was beautiful and the activities were well organized. The host was very professional.',
        isPublic: true
      },
      {
        experience: experiences[3]?._id,
        guest: guest._id,
        overallRating: 5,
        comment: 'Incredible experience! The host was passionate about what they do and it really showed. I learned so much and had a wonderful time.',
        isPublic: true
      }
    ];

    // Remove existing reviews for these experiences
    await Review.deleteMany({ experience: { $in: experiences.map(e => e._id) } });

    const docs = await Review.insertMany(reviewSamples);
    res.json({ message: 'Experience reviews seeded successfully', reviews: docs.length });
  } catch (e) {
    console.error('Seed experience reviews error:', e);
    res.status(500).json({ error: 'Failed to seed experience reviews' });
  }
});