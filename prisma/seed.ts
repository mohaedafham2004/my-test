import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const locations = [
  { province: 'Western',       district: 'Colombo',      town: 'Colombo',      place_name: 'Colombo City',              latitude: 6.9271,  longitude: 79.8612 },
  { province: 'Central',       district: 'Kandy',        town: 'Kandy',        place_name: 'Temple of the Tooth',       special_name: 'Sri Dalada Maligawa', latitude: 7.2906, longitude: 80.6337 },
  { province: 'Central',       district: 'Nuwara Eliya', town: 'Nuwara Eliya', place_name: 'Nuwara Eliya',              latitude: 6.9497,  longitude: 80.7891 },
  { province: 'Central',       district: 'Badulla',      town: 'Ella',         place_name: 'Ella Rock',                 latitude: 6.8667,  longitude: 81.0466 },
  { province: 'Southern',      district: 'Galle',        town: 'Galle',        place_name: 'Galle Fort',                latitude: 6.0328,  longitude: 80.2170 },
  { province: 'Southern',      district: 'Matara',       town: 'Mirissa',      place_name: 'Mirissa Beach',             latitude: 5.9447,  longitude: 80.4505 },
  { province: 'North Central', district: 'Anuradhapura', town: 'Anuradhapura', place_name: 'Anuradhapura Ancient City', latitude: 8.3114,  longitude: 80.4037 },
  { province: 'North Central', district: 'Polonnaruwa',  town: 'Polonnaruwa',  place_name: 'Polonnaruwa Ruins',         latitude: 7.9403,  longitude: 81.0188 },
  { province: 'Uva',           district: 'Badulla',      town: 'Haputale',     place_name: "Lipton's Seat",             latitude: 6.7676,  longitude: 80.9523 },
  { province: 'Sabaragamuwa',  district: 'Ratnapura',    town: 'Ratnapura',    place_name: 'Sinharaja Forest Reserve',  latitude: 6.4014,  longitude: 80.4167 },
  { province: 'Northern',      district: 'Jaffna',       town: 'Jaffna',       place_name: 'Jaffna Fort',               latitude: 9.6615,  longitude: 80.0255 },
];

async function main() {
  console.log('Seeding locations...');
  for (const loc of locations) {
    await prisma.location.create({ data: loc });
  }
  console.log(`Seeded ${locations.length} locations.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
