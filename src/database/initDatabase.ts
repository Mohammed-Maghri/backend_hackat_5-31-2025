import fs from "fs";
import path from "path";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

const DB_PATH = path.resolve("src/database/database.db");
const SQL_PATH = path.resolve("src/database/instructions.sql");

const categoryMap: { [key: number]: string } = {
  1: "Technology",
  2: "Health",
  3: "Education",
  4: "Sports",
  5: "Culture",
  6: "Business",
};

export const initDatabase = async () => {
  // Open or create the SQLite database
  const db = await open({
    filename: DB_PATH,
    driver: sqlite3.Database,
  });

  // Read and execute the schema SQL
  const schema = fs.readFileSync(SQL_PATH, "utf-8");
  await db.exec(schema);
  console.log("✅ Database schema created or verified.");

  // Insert the user "Ayoub Bablil" if not exists
  const existingUser = await db.get("SELECT * FROM users WHERE login = ?", [
    "abablil",
  ]);
  if (!existingUser) {
    await db.run(
      `INSERT INTO users 
      (first_name, last_name, email, login, images, role, club_staff, expo_notification_token) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        "Ayoub",
        "Bablil",
        "abablil@student.1337.ma",
        "abablil",
        "https://cdn.intra.42.fr/users/48a65ddc55523358c6ca1264fa6c6009/large_abablil.jpg",
        1, // role: 0 = user
        false, // club_staff
        "", // expo_notification_token
      ]
    );
    console.log("✅ User 'Ayoub Bablil' inserted.");
  } else {
    console.log("✅ User 'Ayoub Bablil' already exists. Skipping insertion.");
  }

  // Check if categories exist, insert defaults if empty
  const categories = await db.all("SELECT * FROM categories");
  if (categories.length === 0) {
    const defaultCategories = [
      "Technology",
      "Health",
      "Education",
      "Sports",
      "Culture",
      "Business",
    ];
    for (const name of defaultCategories) {
      await db.run("INSERT INTO categories (category_name) VALUES (?)", [name]);
    }
    console.log("✅ Default categories inserted.");
  } else {
    console.log("✅ Categories already exist. Skipping default insertion.");
  }

  // Check if events exist, insert sample events if empty
  const events = await db.all("SELECT * FROM events");
  if (events.length === 0) {
    const sampleEvents = [
      {
        title: "AI & Innovation Hackathon",
        description: "A weekend dedicated to building innovative AI solutions.",
        location: "Casablanca",
        date: "2025-11-10T09:00:00Z",
        image_url:
          "https://www.istockphoto.com/photo/group-of-people-working-on-computers-in-a-hackathon-gm1212001230-353456789",
        status: "completed",
        category_id: 1,
        slots: 50,
        latitude: 33.5731,
        longitude: -7.5898,
      },
      {
        title: "Cybersecurity Awareness Workshop",
        description: "Learn how to stay safe online and protect your data.",
        location: "Rabat",
        date: "2025-10-15T14:00:00Z",
        image_url:
          "https://www.istockphoto.com/photo/cybersecurity-training-session-gm1212004567-987654321",
        status: "upcoming",
        category_id: 1,
        slots: 30,
        latitude: 34.0209,
        longitude: -6.8416,
      },
      {
        title: "Health & Wellness Fair",
        description:
          "A full day of fitness classes, health screenings, and nutrition talks.",
        location: "Marrakech",
        date: "2025-09-20T10:00:00Z",
        image_url: "https://stock.adobe.com/images/health-fair-event/987654321",
        status: "upcoming",
        category_id: 2,
        slots: 100,
        latitude: 31.6295,
        longitude: -7.9811,
      },
      {
        title: "Mental Health Awareness Walk",
        description:
          "Join us in raising awareness for mental health through a community walk.",
        location: "Agadir",
        date: "2025-09-25T09:00:00Z",
        image_url:
          "https://www.istockphoto.com/photo/mental-health-awareness-walk-gm1212006543-321456987",
        status: "upcoming",
        category_id: 2,
        slots: 70,
        latitude: 30.4278,
        longitude: -9.5981,
      },
      {
        title: "Women in Leadership Forum",
        description: "Empowering women to lead in business and society.",
        location: "Fes",
        date: "2025-10-05T10:00:00Z",
        image_url:
          "https://www.gettyimages.com/detail/photo/women-leadership-conference-royalty-free-image/123456789",
        status: "upcoming",
        category_id: 6,
        slots: 40,
        latitude: 34.0331,
        longitude: -5.0003,
      },
      {
        title: "Startup Pitch Night",
        description:
          "Entrepreneurs pitch their ideas to investors and mentors.",
        location: "Tangier",
        date: "2025-11-01T18:00:00Z",
        image_url:
          "https://www.freepik.com/free-photo/startup-pitch-night_23456789.htm",
        status: "upcoming",
        category_id: 6,
        slots: 25,
        latitude: 35.7595,
        longitude: -5.8339,
      },
    ];
    for (const event of sampleEvents) {
      const category_name = categoryMap[event.category_id] || "Unknown";
      await db.run(
        `INSERT INTO events 
        (title, description, location, date, image_url, status, category_id, category_name, slots, total_slots, latitude, longitude, creator_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          event.title,
          event.description,
          event.location,
          event.date,
          event.image_url,
          event.status,
          event.category_id,
          category_name, // <-- Add category_name here
          0,
          event.slots, // total_slots = initial slots
          event.latitude,
          event.longitude,
          1, // creator_id (system admin)
        ]
      );
    }
    console.log("✅ Sample events inserted.");
  } else {
    console.log("✅ Events already exist. Skipping sample events insertion.");
  }

  return db;
};
