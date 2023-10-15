const express = require("express");
const Redis = require("ioredis");
const { MongoClient } = require("mongodb");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.BackendPORT | 8000;
app.use(cors());

const redis = new Redis({
  host: 'redis', // Redis service name in Docker Compose
  port: 6379,    // Default Redis port
});

// MongoDB Connection
const mongodbConnection = `mongodb+srv://aslambaba:Qwerty1122@maincluster.k2ox6wo.mongodb.net/`;
const client = new MongoClient(mongodbConnection);

const student = [
  {
    name: "John Doe",
    program: "Computer Science",
    university: "Harvard University",
  },
  {
    name: "Alice Smith",
    program: "Engineering",
    university: "Stanford University",
  },
  {
    name: "Bob Johnson",
    program: "Business Administration",
    university: "Massachusetts Institute of Technology (MIT)",
  },
  { name: "Emily Davis", program: "Psychology", university: "Yale University" },
  {
    name: "Michael Wilson",
    program: "Medicine",
    university: "Johns Hopkins University",
  },
  {
    name: "Sarah Brown",
    program: "History",
    university: "Princeton University",
  },
  {
    name: "David Lee",
    program: "Physics",
    university: "California Institute of Technology (Caltech)",
  },
  {
    name: "Jennifer Kim",
    program: "Economics",
    university: "University of Chicago",
  },
  {
    name: "Kevin Turner",
    program: "Political Science",
    university: "Columbia University",
  },
  {
    name: "Laura Martinez",
    program: "Chemistry",
    university: "University of California, Berkeley",
  },
];

const teachers = [
  {
    name: "John Smith",
    expertise: "Mathematics",
    experience: 15,
  },
  {
    name: "Sarah Johnson",
    expertise: "English Literature",
    experience: 12,
  },
  {
    name: "Michael Brown",
    expertise: "History",
    experience: 10,
  },
  {
    name: "Emily Davis",
    expertise: "Science",
    experience: 8,
  },
  {
    name: "David Wilson",
    expertise: "Computer Science",
    experience: 7,
  },
  {
    name: "Linda Martinez",
    expertise: "Art",
    experience: 9,
  },
  {
    name: "Robert Taylor",
    expertise: "Physical Education",
    experience: 11,
  },
  {
    name: "Karen Anderson",
    expertise: "Music",
    experience: 14,
  },
  {
    name: "James White",
    expertise: "Foreign Languages",
    experience: 13,
  },
  {
    name: "Jennifer Adams",
    expertise: "Geography",
    experience: 6,
  },
];

const schoolStaff = [
  {
    role: "Principal",
    name: "Mark Johnson",
    experience: 20,
  },
  {
    role: "Vice Principal",
    name: "Alice Brown",
    experience: 18,
  },
  {
    role: "School Counselor",
    name: "Laura Smith",
    experience: 15,
  },
  {
    role: "Librarian",
    name: "Thomas Wilson",
    experience: 12,
  },
  {
    role: "Administrative Assistant",
    name: "Jennifer Davis",
    experience: 8,
  },
  {
    role: "Janitor",
    name: "Michael Taylor",
    experience: 6,
  },
  {
    role: "Nurse",
    name: "Emily Martinez",
    experience: 10,
  },
  {
    role: "IT Technician",
    name: "David Anderson",
    experience: 9,
  },
  {
    role: "Cafeteria Manager",
    name: "Karen White",
    experience: 11,
  },
  {
    role: "Security Guard",
    name: "Robert Adams",
    experience: 7,
  },
];
async function insertDocuments(collectionName, documents) {
  try {
    await client.connect();
    const database = client.db("school");
    const collection = database.collection(collectionName);

    const results = await collection.insertMany(documents);
    console.log(
      `Inserted ${results.insertedCount} documents into ${collectionName}`
    );
  } catch (err) {
    console.log("Error:", err);
  }
}

async function AddStudentsDemoRecord() {
  await insertDocuments("students", student);
}

async function AddTeacherDemoRecord() {
  await insertDocuments("teachers", teachers);
}

async function AddStaffDemoRecord() {
  await insertDocuments("staff", schoolStaff);
}

// RUN THIS FUNCTION TO ADD DEMO RECORDS INTO STUDENTS
// AddStudentsDemoRecord().catch(console.error);

// RUN THIS FUNCTION TO ADD DEMO RECORDS INTO TEACHERS
// AddTeacherDemoRecord().catch(console.error);

// RUN THIS FUNCTION TO ADD DEMO RECORDS INTO STAFF
// AddStaffDemoRecord().catch(console.error);

async function setRecordOnRedis(collection, data) {
  await redis.lpush(collection, JSON.stringify(data));
  await redis.expire(collection, 3600);
}

async function getRecordFromRedis(collection) {
  const value = await redis.lrange(collection, 0, -1);
  return value;
}

async function getRecordFromMongo(collectionName) {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        const database = client.db("school");
        const collection = database.collection(collectionName);
        const findResult = await collection.find({}).toArray();
        resolve(findResult);
      } catch (error) {
        reject(error);
      }
    }, 5000); // 5000 milliseconds = 5 seconds
  });
}

// GET STUDENTS RECORDS
app.get("/students", async (req, res) => {
  let result = await getRecordFromRedis("students");
  if (result.length != 0) {
    console.log("Came from REDIS", result);
    res.send(`${result}`);
  } else {
    const result = await getRecordFromMongo("students");
    setRecordOnRedis("students", result);
    console.log("Came from MONGODB", result);
    res.send(JSON.stringify(result));
  }
});

// GET TEACHERS RECORDS
app.get("/teachers", async (req, res) => {
  let result = await getRecordFromRedis("teachers");
  if (result.length != 0) {
    console.log("Came from REDIS", result);
    res.send(`${result}`);
  } else {
    const result = await getRecordFromMongo("teachers");
    setRecordOnRedis("teachers", result);
    console.log("Came from MONGODB", result);
    res.send(JSON.stringify(result));
  }
});

// GET STAFF RECORDS
app.get("/staff", async (req, res) => {
  let result = await getRecordFromRedis("staff");
  if (result.length != 0) {
    console.log("Came from REDIS", result);
    res.send(`${result}`);
  } else {
    const result = await getRecordFromMongo("staff");
    setRecordOnRedis("staff", result);
    console.log("Came from MONGODB", result);
    res.send(JSON.stringify(result));
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
