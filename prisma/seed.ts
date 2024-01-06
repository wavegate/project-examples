import { db } from "../src/server/db";
import { faker } from "@faker-js/faker";

async function main() {
  const id = "clr06k93f0000cx5nfwoiin0i";
  for (let i = 0; i < 1000; i++) {
    db.bug
      .create({
        data: {
          title: faker.lorem.sentence(),
          description: faker.lorem.paragraph(),
          reporter: { connect: { id } },
        },
      })
      .then(() => {
        console.log("generated");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const severities = ["Critical", "High", "Medium", "Low"];
  for (const name of severities) {
    await db.severity.create({
      data: { name },
    });
  }

  const priorities = ["Immediate", "High", "Medium", "Low"];
  for (const name of priorities) {
    await db.priority.create({
      data: { name },
    });
  }

  const statuses = [
    "Open",
    "In Progress",
    "Resolved",
    "Closed",
    "Won't Fix",
    "Duplicate",
  ];
  for (const name of statuses) {
    await db.status.create({
      data: { name },
    });
  }

  const environments = [
    "Development",
    "Quality Assurance",
    "Staging",
    "Production",
    "User Acceptance Testing",
    "Local",
    "Test",
    "Continuous Integration",
  ];
  for (const name of environments) {
    await db.environment.create({
      data: { name },
    });
  }
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
