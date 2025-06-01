import fs from "fs";
import path from "path";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

const DB_PATH = path.resolve("src/database/database.db");
const SQL_PATH = path.resolve("src/database/instructions.sql");

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

  // Check if events exist, insert 6 sample events if empty
  const events = await db.all("SELECT * FROM events");
  if (events.length === 0) {
    const sampleEvents = [
      {
        title: "AI & Innovation Hackathon",
        description: "A weekend dedicated to building innovative AI solutions.",
        location: "Casablanca",
        date: "2025-11-10T09:00:00Z",
        image_url: "https://example.com/images/hackathon.jpg",
        latitude: 33.5731,
        longitude: -7.5898,
        status: "upcoming",
        category_name: "Technology",
        slots: 50,
        total_slots: 50,
        creator_id: 1,
      },
      {
        title: "Cybersecurity Awareness Workshop",
        description: "Learn how to stay safe online and protect your data.",
        location: "Rabat",
        date: "2025-10-15T14:00:00Z",
        image_url: "https://example.com/images/cyber.jpg",
        latitude: 34.0209,
        longitude: -6.8416,
        status: "upcoming",
        category_name: "Technology",
        slots: 30,
        total_slots: 30,
        creator_id: 1,
      },
      {
        title: "Health & Wellness Fair",
        description:
          "A full day of fitness classes, health screenings, and nutrition talks.",
        location: "Marrakech",
        date: "2025-09-20T10:00:00Z",
        image_url: "https://example.com/images/healthfair.jpg",
        latitude: 31.6295,
        longitude: -7.9811,
        status: "upcoming",
        category_name: "Health",
        slots: 100,
        total_slots: 100,
        creator_id: 1,
      },
      {
        title: "Mental Health Awareness Walk",
        description:
          "Join us in raising awareness for mental health through a community walk.",
        location: "Agadir",
        date: "2025-09-25T09:00:00Z",
        image_url: "https://example.com/images/walk.jpg",
        latitude: 30.4278,
        longitude: -9.5981,
        status: "upcoming",
        category_name: "Health",
        slots: 70,
        total_slots: 70,
        creator_id: 1,
      },
      {
        title: "Women in Leadership Forum",
        description: "Empowering women to lead in business and society.",
        location: "Fes",
        date: "2025-10-05T10:00:00Z",
        image_url: "https://example.com/images/leadership.jpg",
        latitude: 34.0331,
        longitude: -5.0003,
        status: "upcoming",
        category_name: "Business",
        slots: 40,
        total_slots: 40,
        creator_id: 1,
      },
      {
        title: "Startup Pitch Night",
        description:
          "Entrepreneurs pitch their ideas to investors and mentors.",
        location: "Tangier",
        date: "2025-11-01T18:00:00Z",
        image_url: "https://example.com/images/pitchnight.jpg",
        latitude: 35.7595,
        longitude: -5.8339,
        status: "upcoming",
        category_name: "Business",
        slots: 25,
        total_slots: 25,
        creator_id: 1,
      },
    ];

    for (const event of sampleEvents) {
      await db.run(
        `INSERT INTO events 
        (title, description, location, date, image_url, latitude, longitude, status, category_name, slots, total_slots, creator_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          event.title,
          event.description,
          event.location,
          event.date,
          event.image_url,
          event.latitude,
          event.longitude,
          event.status,
          event.category_name,
          event.slots,
          event.total_slots,
          event.creator_id,
        ]
      );
    }
    console.log("✅ Sample events inserted.");
  } else {
    console.log("✅ Events already exist. Skipping sample events insertion.");
  }
  return db;
};
