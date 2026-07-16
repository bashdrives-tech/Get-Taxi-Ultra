import { Destination, VehicleOption, TripType, BlogPost } from './types';

export const VEHICLES: VehicleOption[] = [
  {
    id: 'sedan',
    name: 'Premium Sedan',
    type: 'Sedan',
    seats: 4,
    description: 'Latest models of Dzire, Etios, and Aura. Perfect for budget-friendly comfort, city drives, and hill drops.',
    multiplier: 1.0,
    image: 'fleet-sedan.png'
  },
  {
    id: 'suv_prime',
    name: 'SUV Prime (Ertiga / Innova)',
    type: 'SUV_Prime',
    seats: 7,
    description: 'Spacious Ertiga or standard Innova models. Highly reliable family vehicle with great legroom and luggage capacity.',
    multiplier: 1.2,
    image: 'fleet-suv-prime.png'
  },
  {
    id: 'premium_suv',
    name: 'Premium SUV (Innova Crysta / Innova Hycross)',
    type: 'Premium_SUV',
    seats: 7,
    description: 'Top-of-the-line Innova Crysta and Innova Hycross. Superior suspension, ultimate legroom, dual AC, and luxurious travel comfort.',
    multiplier: 1.45,
    image: 'fleet-suv-premium.png'
  }
];

export const DESTINATIONS: Destination[] = [
  {
    id: 'ooty',
    name: 'Ooty Taxi',
    title: 'Ooty (Udhagamandalam)',
    slogan: 'The Queen of Hill Stations',
    distanceKm: 180, // round-trip distance (90 km each way)
    travelTime: '3.5 Hours (one way)',
    description: 'Nestled in the Nilgiri hills, Ooty is famous for its sprawling tea gardens, serene lakes, towering pine forests, and cool mountain weather. It is the ultimate escape from the plains.',
    highlights: ['Lush tea estates', 'Heritage toy train', 'Breathtaking viewpoints', 'Boating on Ooty Lake'],
    sightseeing: [
      { name: 'Ooty Botanical Gardens', description: 'Established in 1848, this 55-acre garden features thousands of exotic plants and a fossilized tree trunk estimated to be 20 million years old.' },
      { name: 'Doddabetta Peak', description: 'The highest mountain in the Nilgiri Hills at 2,637 metres, offering unmatched panoramic views of surrounding valleys and forests.' },
      { name: 'Ooty Lake & Boating', description: 'An artificial lake built in 1824, offering beautiful pedal, row, and motorboat experiences under the shade of eucalyptus trees.' },
      { name: 'Coonoor Sightseeing', description: 'Just 20 km below Ooty, explore Sims Park, Dolphin’s Nose, and Lamb’s Rock for spectacular mountain gap views.' }
    ],
    bestTimeToVisit: 'October to June',
    bgColor: 'from-emerald-50 to-teal-50 border-emerald-100',
    bannerImage: 'dest-ooty.png'
  },
  {
    id: 'munnar',
    name: 'Munnar Taxi',
    title: 'Munnar',
    slogan: 'Kashmir of South India',
    distanceKm: 320, // round-trip distance (160 km each way)
    travelTime: '4.5 Hours (one way)',
    description: 'Munnar is a majestic hill town in Kerala, renowned for its emerald-green tea plantations, misty valleys, rich wildlife sanctuaries, and cascading mountain waterfalls.',
    highlights: ['Sprawling tea gardens', 'Misty mountain valleys', 'Rare Nilgiri Tahr sightings', 'Scenic dams & echo points'],
    sightseeing: [
      { name: 'Eravikulam National Park', description: 'Famed sanctuary sanctuary home to the endangered mountain goat - the Nilgiri Tahr, offering panoramic trekking heights.' },
      { name: 'Mattupetty Dam & Lake', description: 'A scenic storage concrete gravity dam situated in the hills, famous for its speedboat activities and elephant sightings.' },
      { name: 'Tea Museum (Tata Tea)', description: 'Understand the rich history and process of tea leaves manufacturing, from plucking to ultimate powder processing.' },
      { name: 'Echo Point', description: 'A gorgeous natural acoustic phenomena point where every shout echoes back clearly, surrounded by mist and clean waters.' }
    ],
    bestTimeToVisit: 'September to May',
    bgColor: 'from-green-50 to-lime-50 border-green-100',
    bannerImage: 'dest-munnar.png'
  },
  {
    id: 'kodaikanal',
    name: 'Kodaikanal Taxi',
    title: 'Kodaikanal',
    slogan: 'The Princess of Hill Stations',
    distanceKm: 340, // round-trip distance (170 km each way)
    travelTime: '4.5 Hours (one way)',
    description: 'Perched on the Palani Hills, Kodaikanal is loved for its star-shaped lake, pine groves, cool misty atmosphere, and spectacular vertical cliff viewpoints.',
    highlights: ['Charming star-shaped lake', 'Mystical pine forests', 'Spectacular sheer drop valleys', 'Fragrant homemade chocolates'],
    sightseeing: [
      { name: 'Kodaikanal Lake', description: 'A beautiful star-shaped man-made lake at the center, perfect for cycling along the banks, horse riding, and rowing.' },
      { name: 'Coaker’s Walk', description: 'A narrow pedestrian path paved along steep mountain edges, offering incredibly dramatic views of clouds sweeping over the plains.' },
      { name: 'Pine Forest', description: 'A towering, majestic grove of pine trees planted in 1906, creating a mystical, quiet atmosphere perfect for photography.' },
      { name: 'Pillar Rocks', description: 'Three massive vertical granite rock boulders standing shoulder-to-shoulder, rising 400 feet into the clouds.' }
    ],
    bestTimeToVisit: 'September to June',
    bgColor: 'from-teal-50 to-cyan-50 border-teal-100',
    bannerImage: 'dest-kodaikanal.png'
  },
  {
    id: 'coorg',
    name: 'Coorg Taxi',
    title: 'Coorg (Kodagu)',
    slogan: 'Scotland of India',
    distanceKm: 620, // round-trip distance (310 km each way)
    travelTime: '7 Hours (one way)',
    description: 'Coorg is a gorgeous, mist-covered mountain district in Karnataka, renowned for its sprawling organic coffee fields, majestic waterfalls, and unique local culture.',
    highlights: ['Misty coffee estates', 'Dubare Elephant Camp', 'Abbey Waterfalls', 'Golden Temple Buddhist Monastery'],
    sightseeing: [
      { name: 'Abbey Falls', description: 'A beautiful waterfall located amidst spice plantations and coffee gardens, where water cascades down from 70 feet.' },
      { name: 'Namdroling Golden Temple', description: 'The largest teaching center of the Nyingmapa lineage of Tibetan Buddhism in the world, home to over 5,000 monks.' },
      { name: 'Raja’s Seat', description: 'A scenic seasonal garden of flowers and artificial fountains perched on a hill, offering stunning sunset views of rolling hills.' },
      { name: 'Dubare Elephant Camp', description: 'An eco-tourism camp on the banks of Kaveri River where visitors can feed, bathe, and learn about Asiatic elephants.' }
    ],
    bestTimeToVisit: 'October to May',
    bgColor: 'from-amber-50 to-orange-50 border-orange-100',
    bannerImage: 'dest-coorg.png'
  },
  {
    id: 'wayanad',
    name: 'Wayanad Taxi',
    title: 'Wayanad',
    slogan: 'The Land of Paddy Fields',
    distanceKm: 480, // round-trip distance (240 km each way)
    travelTime: '6 Hours (one way)',
    description: 'Wayanad is a green upland plateau in Kerala, rich with misty sub-tropical rainforests, ancient mysterious caves, spice plantations, and abundant mountain wildlife.',
    highlights: ['Spices & tea plantations', 'Edakkal Caves hiking', 'Banasura Sagar Earth Dam', 'Pristine wildlife sanctuaries'],
    sightseeing: [
      { name: 'Edakkal Caves', description: 'Natural caves featuring pre-historic petroglyphs and rock carvings dating back more than 8,000 years, requiring a scenic uphill climb.' },
      { name: 'Banasura Sagar Dam', description: 'The largest earth dam in India and the second largest in Asia, offering breathtaking mountain-view speedboating.' },
      { name: 'Pookode Lake', description: 'A natural freshwater lake shaped like India’s map, surrounded by dense evergreen woods and hosting rowboats and trails.' },
      { name: 'Lakkidi View Point', description: 'Known as the gateway to Wayanad, offering a sweeping bird’s-eye view of deep lush valleys and the winding mountain pass highway.' }
    ],
    bestTimeToVisit: 'September to May',
    bgColor: 'from-emerald-50 to-green-50 border-emerald-200',
    bannerImage: 'dest-wayanad.png'
  },
  {
    id: 'valparai',
    name: 'Valparai Taxi',
    title: 'Valparai',
    slogan: 'Unexplored Western Ghats Paradise',
    distanceKm: 220, // round-trip distance (110 km each way)
    travelTime: '3.5 Hours (one way)',
    description: 'Valparai is an offbeat hill station surrounded by lush evergreen forests, tea gardens, and rich wildlife. The road climbing up from Pollachi features 40 thrilling hairpin bends.',
    highlights: ['40 hair-pin bend drive', 'Frequent wildlife sightings', 'Untouched natural beauty', 'Stunning water reservoirs'],
    sightseeing: [
      { name: 'Aliyar Dam & Park', description: 'Situated at the foothills of Valparai, a massive dam featuring beautiful theme parks, aquarium, and scenic mountain backgrounds.' },
      { name: 'Sholayar Dam', description: 'One of the deepest reservoirs in Asia, framed by majestic tropical wet evergreen forests.' },
      { name: 'Nallamudi Viewpoint', description: 'Requires a gentle walk through tea gardens, leading to a breathtaking vertical view of deep tribal valleys and waterfalls.' },
      { name: 'Loam’s View Point', description: 'Located at the 9th hairpin bend, offering incredible views of the winding roads and Aliyar reservoir below.' }
    ],
    bestTimeToVisit: 'September to May',
    bgColor: 'from-amber-50 to-emerald-50 border-amber-100',
    bannerImage: 'dest-valparai.png'
  },
  {
    id: 'coonoor',
    name: 'Coonoor Taxi',
    title: 'Coonoor',
    slogan: 'Charming Nilgiri Tea Hills',
    distanceKm: 140, // round-trip distance (70 km each way)
    travelTime: '2.5 Hours (one way)',
    description: 'Coonoor is the second-largest hill station in the Nilgiris, loved for its peaceful environment, heritage toy train station, and endless green carpet tea gardens.',
    highlights: ['Sim’s Botanical Park', 'Dolphin’s Nose overlook', 'Endless tea gardens', 'Mild mountain climate'],
    sightseeing: [
      { name: 'Sim’s Park', description: 'A beautifully manicured 12-hectare botanical park established in 1874, showcasing hundreds of rare species of trees and colorful flowers.' },
      { name: 'Dolphin’s Nose', description: 'An enormous vertical rock cliff that resembles a dolphin’s nose, offering majestic views of Catherine Falls and sweeping gaps.' },
      { name: 'Lamb’s Rock', description: 'A scenic peak offering magnificent views of the Coimbatore plains and the steep slopes of the Nilgiri hills.' },
      { name: 'Highfield Tea Factory', description: 'An active, historic tea plantation and factory tour detailing the complete process of Nilgiri orthodox tea crafting.' }
    ],
    bestTimeToVisit: 'October to June',
    bgColor: 'from-teal-50 to-emerald-50 border-teal-200',
    bannerImage: 'dest-coonoor.png'
  },
  {
    id: 'mysore',
    name: 'Mysore Palace Taxi',
    title: 'Mysore (Mysuru)',
    slogan: 'The City of Palaces',
    distanceKm: 400, // round-trip distance (200 km each way)
    travelTime: '4.5 Hours (one way)',
    description: 'Mysore is famous for its glittering heritage palaces, magnificent royal gardens, and traditional silk and sandalwood markets. It is a stunning cultural weekend tour starting from Coimbatore.',
    highlights: ['Glittering Amba Vilas Palace', 'Beautiful Brindavan Gardens', 'Scenic Chamundi Hill', 'Rich heritage & culture'],
    sightseeing: [
      { name: 'Mysore Palace (Amba Vilas)', description: 'One of the largest and most spectacular palaces in India, outstandingly illuminated with nearly 100,000 light bulbs on Sundays and festivals.' },
      { name: 'Chamundi Hills & Temple', description: 'Located at a height of 1,000 metres, offering panoramic views of the palace city and hosting the historic 17th-century Chamundeshwari Temple.' },
      { name: 'Brindavan Gardens', description: 'Symmetric terraced ornamental gardens situated below the Krishnarajasagar Dam, featuring music-synchronized fountain light shows.' },
      { name: 'St. Philomena’s Cathedral', description: 'A magnificent Neo-Gothic cathedral built in 1936, inspired by the Cologne Cathedral in Germany.' }
    ],
    bestTimeToVisit: 'October to March (Excellent during Dasara festival)',
    bgColor: 'from-yellow-50 to-amber-50 border-yellow-100',
    bannerImage: 'dest-mysore.png'
  },
  {
    id: 'adiyogi',
    name: 'Adiyogi / Isha Temple Taxi',
    title: 'Isha Yoga Center & Adiyogi',
    slogan: 'A Sacred Spiritual Destination',
    distanceKm: 60, // round-trip distance (30 km each way)
    travelTime: '1.2 Hours (one way)',
    description: 'Located at the scenic foothills of the Velliangiri Mountains, the Isha Yoga Center features the incredible 112-foot Adiyogi Shiva statue, Dhyanalinga, and active yoga spots.',
    highlights: ['112-foot Adiyogi Shiva Statue', 'Dhyanalinga & Linga Bhairavi', 'Evening 3D laser light show', 'Serene mountain foothills'],
    sightseeing: [
      { name: 'Adiyogi Shiva Statue', description: 'Recognized by Guinness World Records as the largest bust sculpture in the world, representing the source of Yoga.' },
      { name: 'Dhyanalinga', description: 'A powerful, multi-religious meditative space consecrated by Sadhguru, requiring absolute silence and focus.' },
      { name: 'Linga Bhairavi Temple', description: 'A unique temple honoring the feminine divine energy, representing creative and nurturing aspects of nature.' },
      { name: 'Theerthakunds (Suryakund & Chandrakund)', description: 'Subterranean water bodies energized by consecrated lingas where devotees dip to purify prior to entering the spaces.' }
    ],
    bestTimeToVisit: 'Year-round (Best in evening for Light Show)',
    bgColor: 'from-violet-50 to-fuchsia-50 border-violet-100',
    bannerImage: 'dest-adiyogi.png'
  },
  {
    id: 'madurai',
    name: 'Madurai Taxi',
    title: 'Madurai',
    slogan: 'The Temple City of India',
    distanceKm: 420, // round-trip distance (210 km each way)
    travelTime: '4.5 Hours (one way)',
    description: 'Madurai is one of the oldest continuously inhabited cities in the world. It is centered around the breathtaking Meenakshi Amman Temple and famous for its fragrant jasmine and authentic street foods.',
    highlights: ['Magnificent Meenakshi Amman Temple', 'Ancient historical palace tours', 'Famous street food tour', 'Vibrant traditional culture'],
    sightseeing: [
      { name: 'Meenakshi Amman Temple', description: 'A masterclass of Dravidian architecture featuring 14 majestic gateway towers (Gopurams) covered in thousands of colorful stone figures.' },
      { name: 'Thirumalai Nayakkar Palace', description: 'A 17th-century royal palace built by King Thirumalai Nayak, featuring grand pillars, massive arches, and a nightly light show.' },
      { name: 'Gandhi Memorial Museum', description: 'Set in a historic palace, it exhibits rare relics, letters, and the blood-stained garment worn by Mahatma Gandhi during his assassination.' },
      { name: 'Alagar Kovil (Temple)', description: 'A temple nestled in scenic hills dedicated to Lord Vishnu, featuring exquisite stone carvings and mountain spring paths.' }
    ],
    bestTimeToVisit: 'October to March',
    bgColor: 'from-orange-50 to-amber-50 border-orange-100',
    bannerImage: 'dest-madurai.png'
  }
];

/**
 * Calculates the exact final fare based on the requested parameters.
 * Follows the master pricing logic for Get Taxi Kovai.
 */
export function calculateTaxiFare(
  vehicleType: string,
  tripType: TripType,
  destination: string,
  daysNeeded: number,
  distanceKm: number
): {
  fare: number;
  inclusions: string;
  overageRate: string;
  tripPackage: string;
  vehicleSelected: string;
  isEnquiryOnly?: boolean;
  breakdown: {
    billableDistance: number;
    driverBeta: number;
    subtotal: number;
    estimatedTotal: number;
  };
} {
  const distance = Math.max(0, distanceKm);
  const days = Math.max(1, daysNeeded);
  
  let fare = 0;
  let inclusions = '';
  let overageRate = '';
  let tripPackage = '';
  let vehicleSelected = '';
  let billableDistance = distance;
  let driverBeta = 0;

  if (vehicleType === 'SUV_Prime') {
    vehicleSelected = 'SUV Prime (Ertiga / Innova)';
    
    if (tripType === 'hourly') {
      const hours = Math.max(1, Math.min(12, daysNeeded));
      const includedKm = hours * 10;
      tripPackage = `${hours} Hours SUV Prime Rental`;
      const baseFare = hours * 450;
      const extraKm = Math.max(0, distance - includedKm);
      fare = baseFare + (extraKm * 35);
      inclusions = `Includes ${hours} hours of local travel up to ${includedKm} km.`;
      overageRate = 'Extra kilometers driven will be billed at ₹35 per km.';
    } else if (tripType === 'local') {
      tripPackage = 'Local Day Trip within Coimbatore';
      fare = 120 + (distance * 35);
      inclusions = `Includes local SUV Prime travel. Base fare is ₹120.`;
      overageRate = 'Kilometers driven billed at ₹35 per km.';
    } else if (tripType === 'one_way') {
      tripPackage = `One-Way SUV Prime Drop to ${destination || 'Destination'}`;
      billableDistance = Math.max(130, distance);
      driverBeta = 550;
      fare = (billableDistance * 20) + driverBeta;
      inclusions = `Includes SUV Prime one-way drop with 130 km minimum coverage and Driver Beta.`;
      overageRate = 'Extra kilometers driven will be billed at ₹20 per km.';
    } else {
      const daysStr = days === 1 ? '1 Day' : `${days} Days`;
      tripPackage = `${daysStr} SUV Prime Tour to ${destination || 'Destination'}`;
      const minDistance = days * 260;
      billableDistance = Math.max(minDistance, distance);
      driverBeta = days * 550;
      fare = (billableDistance * 18) + driverBeta;
      inclusions = `Includes ${daysStr} round-trip travel up to ${billableDistance} km and Driver Bata.`;
      overageRate = 'Extra kilometers driven will be billed at ₹18 per km.';
    }
  } else if (vehicleType === 'Premium_SUV') {
    vehicleSelected = 'Premium SUV (Innova Crysta / Innova Hycross)';
    
    if (tripType === 'hourly') {
      const hours = Math.max(1, Math.min(12, daysNeeded));
      tripPackage = `${hours} Hours Premium SUV Rental`;
      fare = 0;
      inclusions = `Innova Crysta & Hycross hourly rentals require custom itineraries.`;
      overageRate = 'Direct WhatsApp or Phone Enquiry Required.';
    } else if (tripType === 'local') {
      tripPackage = 'Local Day Trip within Coimbatore';
      fare = 150 + (distance * 40);
      inclusions = `Includes local luxury SUV travel. Base fare is ₹150.`;
      overageRate = 'Kilometers driven billed at ₹40 per km.';
    } else if (tripType === 'one_way') {
      tripPackage = `One-Way Premium SUV Drop to ${destination || 'Destination'}`;
      billableDistance = Math.max(130, distance);
      driverBeta = 600;
      fare = (billableDistance * 24) + driverBeta;
      inclusions = `Includes premium SUV one-way drop with 130 km minimum coverage and Driver Beta.`;
      overageRate = 'Extra kilometers driven will be billed at ₹24 per km.';
    } else {
      const daysStr = days === 1 ? '1 Day' : `${days} Days`;
      tripPackage = `${daysStr} Premium SUV Tour to ${destination || 'Destination'}`;
      const minDistance = days * 260;
      billableDistance = Math.max(minDistance, distance);
      driverBeta = days * 600;
      fare = (billableDistance * 22) + driverBeta;
      inclusions = `Includes ${daysStr} round-trip travel up to ${billableDistance} km and Driver Bata.`;
      overageRate = 'Extra kilometers driven will be billed at ₹22 per km.';
    }
  } else {
    // Default to Sedan (Premium Sedan)
    vehicleSelected = 'Premium Sedan';
    
    if (tripType === 'hourly') {
      const hours = Math.max(1, Math.min(12, daysNeeded));
      const includedKm = hours * 10;
      tripPackage = `${hours} Hours Local Rental`;
      const baseFare = hours * 350;
      const extraKm = Math.max(0, distance - includedKm);
      fare = baseFare + (extraKm * 30);
      inclusions = `Includes ${hours} hours of local travel up to ${includedKm} km.`;
      overageRate = 'Extra kilometers driven will be billed at ₹30 per km.';
    } else if (tripType === 'local') {
      tripPackage = 'Local Day Trip within Coimbatore';
      fare = 80 + (distance * 30);
      inclusions = `Includes local sedan travel. Base fare is ₹80.`;
      overageRate = 'Kilometers driven billed at ₹30 per km.';
    } else if (tripType === 'one_way') {
      tripPackage = `One-Way Drop to ${destination || 'Destination'}`;
      billableDistance = Math.max(130, distance);
      driverBeta = 500;
      fare = (billableDistance * 15) + driverBeta;
      inclusions = `Includes one-way drop with 130 km minimum coverage and Driver Beta.`;
      overageRate = 'Extra kilometers driven will be billed at ₹15 per km.';
    } else {
      const daysStr = days === 1 ? '1 Day' : `${days} Days`;
      tripPackage = `${daysStr} Tour to ${destination || 'Destination'}`;
      const minDistance = days * 260;
      billableDistance = Math.max(minDistance, distance);
      driverBeta = days * 500;
      fare = (billableDistance * 14) + driverBeta;
      inclusions = `Includes ${daysStr} round-trip travel up to ${billableDistance} km and Driver Bata.`;
      overageRate = 'Extra kilometers driven will be billed at ₹14 per km.';
    }
  }

  return {
    fare: Math.round(fare),
    inclusions,
    overageRate,
    tripPackage,
    vehicleSelected,
    isEnquiryOnly: vehicleType === 'Premium_SUV' && tripType === 'hourly',
    breakdown: {
      billableDistance,
      driverBeta,
      subtotal: fare,
      estimatedTotal: Math.round(fare)
    }
  };
}

export const BLOGS: BlogPost[] = [
  {
    id: 'ooty-guide',
    title: 'Best Time to Visit Ooty from Coimbatore',
    date: 'March 2026',
    category: 'Travel Guide',
    summary: 'Planning a trip to the Queen of Hill Stations? Learn about the seasonal weather, best travel routes from Coimbatore, and top scenic highlights.',
    content: [
      'Ooty, the Queen of Hill Stations, is a timeless getaway nestled in the heart of the Nilgiri Hills. Starting from Coimbatore, the 90 km journey is a scenic transition from bustling plains to misty elevations. Choosing the right season to visit is essential to experience Ooty\'s absolute best.',
      'Summer (October to June) is widely considered the peak season. With temperatures hovering around a pleasant 15°C to 25°C, it is perfect for exploring the lush tea gardens, Botanical Gardens, and renting a boat on the Ooty Lake. If you are travelling from Coimbatore during this window, we recommend taking the classic Mettupalayam-Coonoor ghat road for breathtaking sights.',
      'Winter (October to February) brings a chilly charm with temperatures sometimes dropping below 5°C. Early morning frost blankets the pine forests, offering a magical European-like backdrop. For couples and photography enthusiasts, this is the most romantic time. Pack heavy woolens and enjoy hot masala chai in local tea stalls.',
      'The Monsoon (July to September) transforms the hills into a vibrant emerald green. While the hairpin curves can get misty, the waterfalls like Pykara and Katary flow in full force. No matter when you choose to go, Get Taxi Kovai has you covered with expert, certified mountain drivers.'
    ],
    image: 'blog-ooty.png',
    readTime: '4 min read'
  },
  {
    id: 'munnar-vs-kodaikanal',
    title: 'Munnar vs Kodaikanal: Which Hill Station to Choose?',
    date: 'April 2026',
    category: 'Comparison Guide',
    summary: 'Stuck between Kerala\'s tea paradise and Tamil Nadu\'s princess of hills? We break down the travel times, sightseeing, and overall vibes to help you decide.',
    content: [
      'Choosing your next vacation destination can be tough when you have two iconic gems like Munnar and Kodaikanal accessible from Coimbatore. Both offer cool mountain weather and beautiful heights, but their overall vibes and attractions are quite distinct.',
      'Munnar, often called the \'Kashmir of South India\', is dominated by continuous, manicured emerald-green tea estates that blanket entire mountains. It is a haven for peaceful retreats, aromatic spice plantation walks, and seeing rare wildlife like the Nilgiri Tahr at Eravikulam National Park. It lies 160 km from Coimbatore, making it a scenic 4.5-hour drive via Udumalpet.',
      'Kodaikanal, the \'Princess of Hill Stations\', centers around its famous star-shaped man-made lake and towering pine groves. Kodaikanal feels more cozy and atmospheric with sights like Coaker\'s Walk and Pillar Rocks. It is also famous for its mouth-watering homemade chocolates. The drive is roughly 170 km from Coimbatore, climbing up the majestic Palani hills.',
      'The Verdict: If you love endless tea landscapes, misty valleys, and peaceful retreats, Munnar is your match. If you prefer cycling around a central lake, dense pine forests, and vertical drop cliffs, head to Kodaikanal. Our premium cabs support customizable itineraries to both destinations!'
    ],
    image: 'blog-munnar-kodai.png',
    readTime: '5 min read'
  },
  {
    id: 'comfortable-trips',
    title: '5 Tips for a Comfortable Outstation Taxi Trip',
    date: 'May 2026',
    category: 'Travel Tips',
    summary: 'Long taxi journeys through winding mountain ghats can be tiring. Here are five expert travel tips to ensure a relaxing, comfortable cab experience.',
    content: [
      'Embarking on a road trip from Coimbatore to high-altitude spots like Ooty or Valparai is exciting. However, climbing thousands of feet over dozens of hairpin curves can take a toll on your comfort. Here are five simple tips from our seasoned travel team to make your next trip absolutely comfortable.',
      '1. Choose the Right Vehicle: For hill climbs, space is luxury. Our Premium Sedans are cost-effective, but SUV Prime and Premium SUVs offer significantly better suspension, legroom, and stability over steep winding turns, reducing motion sickness.',
      '2. Plan Your Rest Stops: Don\'t rush. Winding roads require focus. We always encourage passengers to take 10-minute breaks to stretch, breathe the fresh mountain air, and enjoy a warm cup of coffee or coconut water.',
      '3. Stay Hydrated and Eat Light: Winding curves can sometimes upset sensitive stomachs. Drinking water and eating light, non-greasy foods before and during the climb will keep you feeling refreshed and energized.',
      '4. Keep Essentials Handy: Keep your camera, motion sickness medication, light sweaters, and water bottles in your hand luggage instead of locking them in the trunk. The temperature drops rapidly as you climb!',
      '5. Trust Your Chauffeur: Our drivers are expert hill navigators. Let them handle the speed and hairpins while you relax, play your favorite music on our cabin audio systems, and capture pristine panoramic views.'
    ],
    image: 'blog-tips.png',
    readTime: '3 min read'
  },
  {
    id: 'valparai-hairpins',
    title: 'Coimbatore to Valparai: Navigating the 40 Hairpin Bends',
    date: 'June 2026',
    category: 'Scenic Drives',
    summary: 'Valparai is an offbeat paradise. Read about the thrilling drive through 40 hairpin bends, scenic viewpoints, and frequent wildlife encounters.',
    content: [
      'Valparai remains one of the most untouched and majestic destinations in the Western Ghats. Located about 110 km from Coimbatore, the journey itself is a legendary attraction, famous for its 40 numbered, thrilling hairpin bends climbing up from the town of Pollachi.',
      'The climb starts past the Aliyar Dam checkpoint, where the road begins its steep ascent. As you snake through the first few loops, look back to catch a beautiful view of the blue Aliyar reservoir glittering in the plains. By the 9th hairpin bend (Loam\'s View Point), you are already high enough to feel the cool, crisp mountain breeze.',
      'What makes the Valparai drive unique is its abundant wildlife. It is very common to spot the majestic Nilgiri Tahr clinging to steep cliffs, or groups of playful Lion-tailed Macaques hanging from roadside trees. Because it is an active elephant corridor, driving here requires high respect for nature, quiet horn usage, and expert control.',
      'Once at the top, you are greeted by sprawling, tranquil tea estates and misty rainforests. It is an off-the-grid haven free from massive tourist crowds. Book a premium Get Taxi Kovai sedan or SUV, and let our skilled hill-certified chauffeurs guide you safely through this breathtaking Western Ghats safari.'
    ],
    image: 'blog-valparai.png',
    readTime: '5 min read'
  }
];

